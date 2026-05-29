# Semantic Memory System — NEURON OS

NEURON OS employs a persistence vector retrieval architecture, allowing the assistant to access historical contexts matching the active query.

## 📐 Vector Similarity Calculations
Text strings are computed into float coordinates representing semantic meanings. We calculate Cosine Similarity between the query vector ($A$) and a database memory vector ($B$):

$$\text{Similarity} = \frac{A \cdot B}{\|A\| \|B\|} = \frac{\sum_{i=1}^{n} A_i B_i}{\sqrt{\sum_{i=1}^{n} A_i^2} \sqrt{\sum_{i=1}^{n} B_i^2}}$$

Scores range between `-1.0` (opposite meaning) and `1.0` (identical meaning). We use a relevance threshold of `0.35` for context injection.

## 🗃️ Memory Categories
1. **Semantic:** Factual concepts, secrets, passwords, or system logs.
2. **Episodic:** Event markers, notes from meetings, or specific dates.
3. **Procedural:** Guides, coding standards, or command parameters.

## 🛠️ Mock NLP Fallback
When API keys are missing, the system runs a deterministic hashing vector generator:
* Splits text into lowercase words.
* Loops through words, generating hash values across `1536` float dimensions.
* Normalizes the cumulative sum.
* Guarantees that similar sentences (sharing words) maintain high cosine similarities.
