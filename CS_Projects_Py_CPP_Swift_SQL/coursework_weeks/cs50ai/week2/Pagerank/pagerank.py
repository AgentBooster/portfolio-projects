import os
import random
import re
import sys

DAMPING = 0.85
SAMPLES = 10000


def main():
    if len(sys.argv) != 2:
        sys.exit("Usage: python pagerank.py corpus")
    corpus = crawl(sys.argv[1])
    ranks = sample_pagerank(corpus, DAMPING, SAMPLES)
    print(f"PageRank Results from Sampling (n = {SAMPLES})")
    for page in sorted(ranks):
        print(f"  {page}: {ranks[page]:.4f}")
    ranks = iterate_pagerank(corpus, DAMPING)
    print(f"PageRank Results from Iteration")
    for page in sorted(ranks):
        print(f"  {page}: {ranks[page]:.4f}")


def crawl(directory):
    """
    Parse a directory of HTML pages and check for links to other pages.
    Return a dictionary where each key is a page, and values are
    a list of all other pages in the corpus that are linked to by the page.
    """
    pages = dict()

    # Extract all links from HTML files
    for filename in os.listdir(directory):
        if not filename.endswith(".html"):
            continue
        with open(os.path.join(directory, filename)) as f:
            contents = f.read()
            links = re.findall(r"<a\s+(?:[^>]*?)href=\"([^\"]*)\"", contents)
            pages[filename] = set(links) - {filename}

    # Only include links to other pages in the corpus
    for filename in pages:
        pages[filename] = set(
            link for link in pages[filename]
            if link in pages
        )

    return pages


def transition_model(corpus, page, damping_factor):
    """
    Return a probability distribution over which page to visit next,
    given a current page.

    With probability `damping_factor`, choose a link at random
    linked to by `page`. With probability `1 - damping_factor`, choose
    a link at random chosen from all pages in the corpus.
    """
    pages = set(corpus.keys())
    total_pages = len(pages)
    links = corpus[page]

    if not links:
        return {p: 1 / total_pages for p in pages}

    distribution = {}
    random_prob = (1 - damping_factor) / total_pages
    linked_prob = damping_factor / len(links)
    for p in pages:
        distribution[p] = random_prob + (linked_prob if p in links else 0)
    return distribution


def sample_pagerank(corpus, damping_factor, n):
    """
    Return PageRank values for each page by sampling `n` pages
    according to transition model, starting with a page at random.

    Return a dictionary where keys are page names, and values are
    their estimated PageRank value (a value between 0 and 1). All
    PageRank values should sum to 1.
    """
    pages = list(corpus.keys())
    counts = {page: 0 for page in pages}

    current = random.choice(pages)
    for _ in range(n):
        counts[current] += 1
        model = transition_model(corpus, current, damping_factor)
        weights = [model[page] for page in pages]
        current = random.choices(pages, weights=weights, k=1)[0]

    return {page: counts[page] / n for page in pages}


def iterate_pagerank(corpus, damping_factor):
    """
    Return PageRank values for each page by iteratively updating
    PageRank values until convergence.

    Return a dictionary where keys are page names, and values are
    their estimated PageRank value (a value between 0 and 1). All
    PageRank values should sum to 1.
    """
    pages = list(corpus.keys())
    total_pages = len(pages)
    ranks = {page: 1 / total_pages for page in pages}

    while True:
        new_ranks = {}
        for page in pages:
            total = 0
            for possible_page in pages:
                links = corpus[possible_page]
                if links:
                    if page in links:
                        total += ranks[possible_page] / len(links)
                else:
                    total += ranks[possible_page] / total_pages
            new_ranks[page] = (1 - damping_factor) / total_pages + damping_factor * total

        if all(abs(new_ranks[page] - ranks[page]) <= 0.001 for page in pages):
            return new_ranks
        ranks = new_ranks


if __name__ == "__main__":
    main()
