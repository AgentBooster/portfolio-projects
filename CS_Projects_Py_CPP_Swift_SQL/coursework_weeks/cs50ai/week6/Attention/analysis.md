# Analysis

## Layer 3, Head 8

In this head, a local attention pattern is observed: many tokens look at their
immediate neighbors (especially determiners towards nouns). This suggests that
the head is capturing very short relationships within the noun phrase.

Example Sentences:
- The [MASK] sat on the chair.
- I saw a [MASK] in the park.

## Layer 10, Head 6

Here, attention tends to flow from the masked token towards the main noun of
the sentence, which seems to support the prediction of the `[MASK]` content
using the global semantic context (subject or object).

Example Sentences:
- She never said a [MASK].
- The man held the [MASK] with his hand.