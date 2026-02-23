# From the Deep

In this problem, you'll write freeform responses to the questions provided in the specification.

## Random Partitioning

Random partitioning tends to spread observations evenly across boats, which balances storage and write load without much coordination. The downside is poor query locality: time-range queries (like midnight to 1am) must hit all boats, increasing latency and cost.

## Partitioning by Hour

Partitioning by hour makes time-range queries efficient because you can target the boat that owns that hour. But if observations cluster in a narrow time window, one boat becomes a hotspot and storage becomes unbalanced.

## Partitioning by Hash Value

Hash partitioning balances writes and storage well because timestamps are evenly distributed across boats, and a single timestamp can be routed to one boat deterministically. However, range queries still require querying all boats, and you lose the ability to exploit time-based locality.
