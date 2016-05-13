# Graph Algorithms

Peter Yi

## Table of Contents
* [Topological Sorting](#topological-sorting)
  * [Kahn's Algorithm](#kahns-algorithm)
  * [Tarjan's Algorithm](#tarjans-algorithm)
* [Shortest Paths](#shortest-paths)
  * [Bellman-Ford Algorithm](#bellman-ford-algorithm)
  * [Dijkstra's Algorithm](#dijkstras-algorithm)

# Topological Sorting

Topological sorting, per Wikipedia:

> In the field of computer science, a topological sort (sometimes abbreviated toposort) or topological ordering of a directed graph is a linear ordering of its vertices such that for every directed edge (u,v) from vertex u to vertex v, u comes before v in the ordering.

Topological sorting is useful for many sorts of problems.  Basically, if the problem statement involves a bunch of things that need information from other things in that set of things, it's probably a topological sort.  One example is the queen's horses problem, where the queen hasn't seen a horse race but people tell her a bunch of things about how each horse finished relative to other horses.  Another one is the build order problem courtesy of CTCI, where a bunch of projects need to be built, but some projects depend on other projects already being built.  Finally, in an Excel spreadsheet, cells that have cell references built into them are calculated in topological order (ex. A1 = 5, A2 = 10, B1 = A1 + A2).

## Kahn's Algorithm

In a directed acyclic graph (DAG), topological sorting can be accomplished in a number of ways.  We've already discussed a breadth-first approach in class (Kahn's algorithm).  In a nutshell, this involves calculating the indegree (number of inward edges) of each vertex, enqueuing all vertices that had no indegrees, then dequeuing vertices one by one, removing all inward edges from the vertex and appending it to a topologically sorted list.  If any edges remain after every vertex has been processed, then there exists a cycle in the graph and topological sorting is impossible.

## Kahn's pseudocode

```
def topo_sort(V):
  # V: set of all vertices v
  # E: set of all edges (u,v)

  # (u,v): directed edge connecting vertex u to vertex v

  initialize list result to contain toposorted vertices
  initialize queue Q to contain all vertices with no incoming edges

  # setup: initialize with all vertices with no incoming edges
  for all v in V:
    if v.indegree == 0:
      Q.enqueue(v)

  # algorithm: process each vertex in topological order
  while Q is not empty:
    dequeue v from Q
    append v to result
    for each neighbor u of v:
      remove (u,v) from E
      if u has no other incoming edges:
        Q.enqueue(u)

  if any v in V has edges:
    raise error: graph has a cycle
  else:
    return result
```

## Tarjan's Algorithm

Let's talk about a depth-first approach instead.  This is an adaptation of Tarjan's algorithm for strongly connected components.

## Tarjan's pseudocode

# V: set of all vertices v

    def topo_sort(V):
      initialize array result to contain toposorted vertices
      initialize boolean array visited of size |V| to false
      for all v in
       V:
        visit(v,result,visited)
      return result

    def visit(v,result,visited):
      if !visited[v]:
        for each neighbor u of v:
          visit(u,result,visited)
        visited[v] = true
        prepend v to result

This algorithm (and Kahn's) runs in `O(|V|+|E|)` time.  We will process each vertex and edge exactly once.

An advantage of the DFS algorithm is that we do not need to first calculate the indegrees of each vertex, which may or may not be readily available depending on how the graph is represented.  We also do not need to modify the graph by removing any edges as we process each vertex.

# Shortest Paths

There are a variety of algorithms available to us to find the shortest paths from a source vertex in a weighted DAG.  The optimal one to use can depend on a number of factors, but mainly depends on whether edges have negative weights or not.

## Bellman-Ford Algorithm

The advantage of using the Bellman-Ford algorithm over Dijkstra's algorithm lies primarily in the fact that Bellman-Ford accounts for negative edge weights.

The Bellman-Ford algorithm calculates shortest paths in a DAG by first initializing all calculated costs to travel from a source vertex to infinity, and then setting the cost of going to the initial vertex to zero.

We can then calculate the shortest path to any given vertex in the DAG by calculating the shortest path to every other vertex `|V|-1` times (i.e., once for every vertex except the source vertex, whose cost is zero).  The way this is accomplished is by _relaxing_ the edges.  Edges are relaxed by taking the minimum of the current calculated cost to the target vertex and the calculated cost achieved from going to the target vertex through another vertex via the edge connecting the two.

### Relaxation pseudocode

```
# v.dist: current calculated distance from source vertex to v
# v.π: predecessor vertex to v along current calculated shortest path
# (u,v): directed edge connecting vertex u to vertex v
# (u,v).weight: weight associated with going from vertex u to vertex v.

def relax(u,v):
  if v.dist < u.dist + (u,v).weight:
    v.dist = u.dist + (u,v).weight
    v.π = u
```

One thing to note is that for a graph with a negative weight cycle (where the edge weights in a cycle can sum to a negative number), relaxation can be run indefinitely.  Bellman-Ford's algorithm is capable of checking for a negative-weight cycle, but the shortest paths calculated for a graph containing a negative weight cycle will be inaccurate.  The algorithm will just error out when it sees a negative weight cycle.

### Bellman-Ford pseudocode

```
# V: set of all vertices v
# E: set of all edges (u,v)
# src: source vertex

# v.dist: current calculated distance from source vertex to v
# v.π: predecessor vertex to v along current calculated shortest path
# (u,v): directed edge connecting vertex u to vertex v
# (u,v).weight: weight associated with going from vertex u to vertex v

def shortest_paths(V,src):
  for v in V:
    v.dist = INFINITY
    v.π = null

  src.dist = 0

  for i in 1..|V|-1:
    for (u,v) in E:
      relax(u,v)

  for (u,v) in E:
    if v.dist > u.dist + (u,v).weight:
      raise error: negative weight cycle detected
```
This algorithm runs in `O(|V||E|)`.  From every vertex, we are looking at every edge and relaxing the edges accordingly until we've looked at all vertices.

Side note: the concept of dynamic programming was birthed from the derivation of this algorithm!

## Dijkstra's Algorithm

Dijkstra's algorithm is similar in concept -- it will repeatedly relax edges using a greedy approach until we reach our target or until all vertices have been processed.  It has a faster runtime than Bellman-Ford, but cannot handle negative edge weights due to this greedy approach.

The idea is that we will process vertices by greedily selecting the shortest weighted edge of all vertices we have not yet processed.  We will then relax the edges of all neighboring vertices of that vertex (using the same concept from Bellman-Ford above).  We then repeat the process until we've processed all the vertices.

This greedy approach will produce inaccurate results when negative edge weights are introduced, as costs may need to be recalculated repeatedly from all possible paths to a particular vertex when negatively weighted edges are present to get the correct shortest path.  Thus, Dijkstra's is unsuitable for such an application.

### Dijkstra's pseudocode

```
def shortest_paths(V,src,target = null):
  initialize priority queue Q to contain all vertices in graph

  for v in V:
    v.dist = INFINITY
    v.π = null
    Q.insert(v)

  src.dist = 0

  while Q is not empty:
    # select v from Q where v.dist is minimal
    dequeue_min v from Q
    # return early if v == target

    for each neighbor u of v:
      relax(u,v)
```

Here's the relaxation pseudocode again, for reference:

```
def relax(u,v):
  if v.dist < u.dist + (u,v).weight:
    v.dist = u.dist + (u,v).weight
    v.π = u
```

If we utilize a data structure where we can access the minimum element in constant time, the runtime of this algorithm becomes near linear.  With a priority queue implemented using a min heap, we can achieve `O((|V|+|E|)log|V|)` time complexity.  Using a Fibonacci heap instead, we can achieve `O(|V|log|V|+|E|)`.  The bottleneck lies in re-heapifying every time we dequeue a vertex from the priority queue.  This is faster than the `O(|V||E|)` given to us by Bellman-Ford; again, however, this approach will not work for a DAG containing negatively weighted edges.
