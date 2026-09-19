const Plant = require('../models/Plant');
const Category = require('../models/Category');
const Order = require('../models/Order');
const KnowledgeBase = require('../models/KnowledgeBase');

// STRICT DEFAULT REFUSAL MESSAGE specified in requirements
const DEFAULT_REFUSAL_MESSAGE = "Sorry, I don't have data about that. I can only help with information available on the PlantNest website.";

// Check if query is completely unrelated to PlantNest / E-Commerce scope
const isGeneralKnowledgeQuery = (queryText) => {
  const q = queryText.toLowerCase().trim();

  // Explicit PlantNest store keywords
  const storeKeywords = [
    'plant', 'plants', 'nursery', 'pot', 'pots', 'soil', 'seed', 'seeds',
    'fertilizer', 'order', 'orders', 'track', 'tracking', 'ship', 'shipping',
    'deliver', 'delivery', 'buy', 'price', 'prices', 'stock', 'cart',
    'plantnest', 'care', 'water', 'sunlight', 'flower', 'flowering',
    'herb', 'herbs', 'succulent', 'succulents', 'bonsai', 'return', 'refund',
    'contact', 'helpline', 'payment', 'cod', 'upi', 'razorpay', 'services', 'landscape'
  ];

  const containsStoreKeyword = storeKeywords.some(kw => q.includes(kw));

  const offTopicPatterns = [
    /\b(java|python|javascript|typescript|c\+\+|html|css|react|node|sql|code|coding|program|programming|software|algorithm|developer)\b/i,
    /\b(joke|jokes|story|poem|song|recipe|cooking|movie|film|actor|sports|cricket|football|match|stadium)\b/i,
    /\b(prime minister|president|politician|election|politics|war|economy|stock market|crypto|bitcoin|forex)\b/i,
    /\b(weather|temperature|forecast|rain|climate change|global warming|typhoon|earthquake)\b/i,
    /\b(quantum|physics|chemistry|algebra|calculus|math|geometry|gravity|astronomy|biology|medical|medicine|doctor)\b/i,
    /\b(who is|what is the capital of|how to code|write a|solve this|calculate|explain quantum)\b/i,
    /\b(tell me a joke|tell me a story|write a poem|what is ai|what is ml|what is java)\b/i
  ];

  for (const pattern of offTopicPatterns) {
    if (pattern.test(q) && !containsStoreKeyword) {
      return true;
    }
  }

  return false;
};

// Call Groq LLM API with strict grounding system prompt
const callGroqAPI = async (systemPrompt, userQuery) => {
  const groqApiKey = process.env.GROQ_API_KEY;
  if (!groqApiKey || !groqApiKey.trim()) {
    return null;
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey.trim()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userQuery }
        ],
        temperature: 0.1,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      console.warn('Groq API HTTP status:', response.status);
      return null;
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content;
    }
  } catch (err) {
    console.warn('Groq API request error:', err.message);
  }

  return null;
};

// @desc    STRICT RAG Chatbot query endpoint
// @route   POST /api/chatbot/query
// @access  Public (Optional user auth)
const queryChatbot = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid question string.'
      });
    }

    const cleanQuery = query.trim();
    const qLower = cleanQuery.toLowerCase();

    // 1. Guardrail Step 1: Detect non-store / general knowledge queries
    if (isGeneralKnowledgeQuery(cleanQuery)) {
      return res.status(200).json({
        success: true,
        answer: DEFAULT_REFUSAL_MESSAGE,
        source: 'strict-rag-refusal'
      });
    }

    // 2. Fetch Live Database Collections from MongoDB
    const [plants, categories, knowledgeEntries] = await Promise.all([
      Plant.find().sort({ name: 1 }).lean(),
      Category.find().lean(),
      KnowledgeBase.find({ isActive: true }).sort({ category: 1 }).lean()
    ]);

    let retrievedContext = '';
    let hasRelevantRetrieval = false;

    // 3. Handle Order Inquiries for Authenticated User (Privacy Protected)
    if (qLower.includes('order') || qLower.includes('track') || qLower.includes('status') || qLower.includes('delivery')) {
      if (req.user) {
        const userOrders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
        if (userOrders && userOrders.length > 0) {
          hasRelevantRetrieval = true;
          const orderSummary = userOrders.map(o => {
            const itemsStr = o.orderItems.map(i => `${i.name} (x${i.quantity})`).join(', ');
            return `• Order #${o._id.toString().slice(-8)} | Status: ${o.orderStatus} | Total: ₹${o.totalAmount} | Payment: ${o.paymentStatus} | Items: ${itemsStr}`;
          }).join('\n');
          retrievedContext += `USER AUTHENTICATED ORDERS:\n${orderSummary}\n\n`;
        } else {
          retrievedContext += `USER AUTHENTICATED ORDERS: No orders placed yet.\n\n`;
          hasRelevantRetrieval = true;
        }
      } else if (qLower.includes('my order') || qLower.includes('where is my order') || qLower.includes('track my order')) {
        return res.status(200).json({
          success: true,
          answer: `To check your active order status, please sign in to your PlantNest user account.`,
          source: 'auth-required'
        });
      }
    }

    // 4. Match Knowledge Base Entries
    const knowledgeKeywords = {
      shipping: ['ship', 'deliver', 'delivery', 'free delivery', 'dispatch', 'courier'],
      returns: ['return', 'refund', 'guarantee', 'replace', 'exchange'],
      contact: ['contact', 'email', 'phone', 'support', 'helpline', 'reach'],
      payment: ['payment', 'pay', 'cod', 'upi', 'card', 'net banking', 'razorpay'],
      services: ['service', 'consultation', 'design', 'landscape', 'expert'],
      faq: ['faq', 'question', 'how', 'why', 'what'],
      policy: ['policy', 'terms', 'condition', 'rule'],
      care: ['care', 'water', 'sunlight', 'soil', 'fertilizer', 'prune', 'repot'],
    };

    for (const entry of knowledgeEntries) {
      const cat = entry.category;
      const keywords = knowledgeKeywords[cat] || [];
      const titleLower = entry.title.toLowerCase();
      const contentLower = entry.content.toLowerCase();

      const matchesKeyword = keywords.some(kw => qLower.includes(kw));
      const matchesTitle = titleLower.split(' ').some(word => word.length > 3 && qLower.includes(word));
      const matchesContent = contentLower.includes(qLower.slice(0, 20));

      if (matchesKeyword || matchesTitle || matchesContent) {
        retrievedContext += `PLANTNEST KNOWLEDGE [${entry.category.toUpperCase()}] - ${entry.title}:\n${entry.content}\n\n`;
        hasRelevantRetrieval = true;
      }
    }

    // 5. Product & Category Matching from MongoDB
    const matchedPlants = plants.filter(p => {
      const pName = p.name.toLowerCase();
      return qLower.includes(pName) || pName.split(' ').some(word => word.length > 3 && qLower.includes(word));
    });

    const matchedCat = categories.find(c =>
      qLower.includes(c.name.toLowerCase()) || qLower.includes(c.slug.toLowerCase())
    );

    const priceMatch = qLower.match(/(?:under|below|less than|max|budget|₹|rs\.?)\s*(\d+)/i);
    let budgetPlants = [];
    if (priceMatch) {
      const maxPrice = parseFloat(priceMatch[1]);
      budgetPlants = plants.filter(p => p.finalPrice <= maxPrice && p.stock > 0);
    }

    if (matchedPlants.length > 0 || matchedCat || budgetPlants.length > 0 || (qLower.includes('plant') && (qLower.includes('available') || qLower.includes('catalog') || qLower.includes('list') || qLower.includes('stock')))) {
      hasRelevantRetrieval = true;

      const relevantCatalog = matchedPlants.length > 0
        ? matchedPlants
        : budgetPlants.length > 0
        ? budgetPlants
        : matchedCat
        ? plants.filter(p => p.category.toLowerCase() === matchedCat.name.toLowerCase())
        : plants;

      const catalogDetails = relevantCatalog.slice(0, 10).map(p =>
        `• Plant Name: "${p.name}" | Category: "${p.category}" | Type: "${p.plantType}" | Final Price: ₹${p.finalPrice} (Original: ₹${p.price}, Discount: ${p.discount}%) | Stock: ${p.stock} units | Sunlight: "${p.sunlight}" | Water: "${p.water}" | Soil: "${p.soil}" | Care: "${p.careInstructions}" | Description: "${p.description}"`
      ).join('\n');

      retrievedContext += `MATCHED PLANTNEST CATALOG ITEMS:\n${catalogDetails}\n\n`;
    }

    // Safeguard: Check if user asked about a specific product/entity that doesn't exist in catalog
    const specificPlantMatch = qLower.match(/(?:do you have|is|are|price of|buy|cost of)\s+([a-z0-9\s]+?)\s+(?:plant|plants|available|in stock|tree)?$/i);
    if (specificPlantMatch && matchedPlants.length === 0 && !matchedCat && budgetPlants.length === 0 && !retrievedContext.includes('PLANTNEST KNOWLEDGE')) {
      const queriedSubject = specificPlantMatch[1].trim();
      if (queriedSubject.length > 2 && !['indoor', 'outdoor', 'flowering', 'succulent', 'bonsai', 'herb', 'all'].includes(queriedSubject)) {
        return res.status(200).json({
          success: true,
          answer: DEFAULT_REFUSAL_MESSAGE,
          source: 'product-not-found-refusal'
        });
      }
    }

    // 6. STRICT RETRIEVAL GATE: If NO relevant PlantNest data was retrieved — Return Default Refusal
    if (!hasRelevantRetrieval || !retrievedContext.trim()) {
      return res.status(200).json({
        success: true,
        answer: DEFAULT_REFUSAL_MESSAGE,
        source: 'strict-rag-refusal'
      });
    }

    // 7. Generate Response using GROQ API (llama-3.3-70b-versatile)
    const systemPrompt = `You are the PlantNest Assistant.

You are NOT a general-purpose AI assistant. You answer ONLY using the verified PlantNest information provided in the retrieved context below.

Do not use outside knowledge. Do not use pretrained knowledge. Do not guess. Do not infer unsupported facts. Do not invent products, prices, stock levels, policies, or store information.

If the retrieved context does NOT contain sufficient information to answer the user's specific question, return EXACTLY this message and NOTHING ELSE:

"${DEFAULT_REFUSAL_MESSAGE}"

CRITICAL RULES:
1. Never use general AI knowledge.
2. Every factual statement must be directly supported by the retrieved PlantNest context below.
3. Format prices in Indian Rupees with ₹ symbol (e.g. ₹499).
4. Be concise, professional, clear, and helpful.

RETRIEVED PLANTNEST CONTEXT:
${retrievedContext}`;

    const groqReply = await callGroqAPI(systemPrompt, cleanQuery);
    if (groqReply && groqReply.trim()) {
      return res.status(200).json({
        success: true,
        answer: groqReply.trim(),
        source: 'groq-strict-rag'
      });
    }

    // 8. Deterministic Local Grounded Generator (Fallback if Groq key missing/failed)
    if (priceMatch && budgetPlants.length > 0) {
      const maxP = parseFloat(priceMatch[1]);
      const listStr = budgetPlants
        .map(p => `• **${p.name}** (${p.category}) - **₹${p.finalPrice}** (Stock: ${p.stock} units)`)
        .join('\n');
      return res.status(200).json({
        success: true,
        answer: `Here are the plants currently available at PlantNest under ₹${maxP}:\n\n${listStr}\n\nWould you like care details for any of these?`,
        source: 'local-strict-rag'
      });
    }

    if (matchedPlants.length > 0) {
      const p = matchedPlants[0];
      return res.status(200).json({
        success: true,
        answer: `🌿 **${p.name}** (${p.category}):\n` +
          `• **Price**: ₹${p.finalPrice} ${p.discount > 0 ? `(${p.discount}% OFF original ₹${p.price})` : ''}\n` +
          `• **Stock**: ${p.stock > 0 ? `${p.stock} units in stock` : 'Currently Out of Stock'}\n` +
          `• **Plant Type**: ${p.plantType || 'Indoor'}\n` +
          `• **Sunlight**: ${p.sunlight}\n` +
          `• **Watering**: ${p.water}\n` +
          `• **Care Instructions**: ${p.careInstructions || p.description}`,
        source: 'local-strict-rag'
      });
    }

    if (matchedCat) {
      const catPlants = plants.filter(p => p.category.toLowerCase() === matchedCat.name.toLowerCase());
      if (catPlants.length === 0) {
        return res.status(200).json({
          success: true,
          answer: `We currently have no plants in stock under the "${matchedCat.name}" category.`,
          source: 'local-strict-rag'
        });
      }
      const catList = catPlants
        .map(p => `• **${p.name}** - **₹${p.finalPrice}** (${p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'})`)
        .join('\n');
      return res.status(200).json({
        success: true,
        answer: `Here are the available plants in our **${matchedCat.name}** collection:\n\n${catList}`,
        source: 'local-strict-rag'
      });
    }

    if (retrievedContext.includes('USER AUTHENTICATED ORDERS') && req.user) {
      const userOrders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
      if (!userOrders || userOrders.length === 0) {
        return res.status(200).json({
          success: true,
          answer: `You currently have no active orders placed with PlantNest.`,
          source: 'local-strict-rag'
        });
      }
      const latestOrder = userOrders[0];
      return res.status(200).json({
        success: true,
        answer: `📦 **Your Recent PlantNest Order #${latestOrder._id.toString().slice(-8)}**:\n` +
          `• **Status**: ${latestOrder.orderStatus}\n` +
          `• **Total Amount**: ₹${latestOrder.totalAmount}\n` +
          `• **Payment**: ${latestOrder.paymentStatus} (${latestOrder.paymentMethod})\n` +
          `• **Items**: ${latestOrder.orderItems.map(i => `${i.name} (x${i.quantity})`).join(', ')}`,
        source: 'local-strict-rag'
      });
    }

    if (retrievedContext.trim().length > 0) {
      return res.status(200).json({
        success: true,
        answer: retrievedContext.trim(),
        source: 'local-strict-rag'
      });
    }

    return res.status(200).json({
      success: true,
      answer: DEFAULT_REFUSAL_MESSAGE,
      source: 'strict-rag-refusal'
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  queryChatbot
};
