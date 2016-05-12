# The Knapsack Problem

## Overview

The knapsack problem is an optimization problem that deals with maximizing the value of a set of items. Traditionally, given a constraint (the "knapsack") and a set of items (with weights and values), one must find the combination of items that maximizes value.

Similarly to the Subset Sum problem, the Knapsack Problem is NP-hard, but has a pseudo-polynomial time solution using dynamic programming.

### Dynamic Programming Solution

In the dynamic programming solution, we create a table with every number from 0 to `capacity` as columns, and every item in the set as rows. Each row represents the set including the current row and all preceding rows, as well as all subsets. The table records the maximum value achievable using the item set represented by a given row with a capacity represented by the column. For example, for a knapsack with a capacity of 9, and three objects with weights and values of `[1, 5, 9]`, the row representing the set for the three items would be:

      0   1   2   3   4   5   6   7   8   9
    | 0 | 1 | 1 | 1 | 1 | 5 | 6 | 6 | 6 | 9 

To generate the table, every cell is iterated through for each row. For the capacity represented by the cell, the maximum achievable value is calculated for the set represented by the row.

Three rules are followed to find the max for a cell:

1. The maximum value is zero if either the capacity or set size is zero. In practice, this means the first row and the first column are filled with zeroes.
  * `matrix[i][w] = 0 if i == 0 || w == 0`
2. If the current weight being considered is greater than the capacity, it will definitely not be included in the knapsack. Therefore, the max value achievable at the current capacity is the same as the max value achievable without the new item. Thus, the value from the row above (from the subset without the new item) is used.
  * `matrix[i][w] = matrix[i-1][w] if weights[i-1] > w`
3. One can either take the new item, or skip the new item. In taking the new item, the maximum value can be computed as the maximum value at capacity = current capacity - new item weight, plus the value of the current item. When skipping the new item, the maximum value is the value of the cell above the current cell (see rule 2). 
  * `with = matrix[i-1][w-weights[i-1]] + values[i-1]`
  * `without = matrix[i-1][w]`
  * `matrix[i][w] = [with, without].max`

Note how rules 2 and 3 use previous solutions to generate new solutions, an example of optimal substructure.

The completed code is as follows: 

    def knapsack(weights, values, capacity)
      matrix = Array.new(weights.length + 1) { Array.new(capacity + 1) { 0 } }

      (weights.length + 1).times do |i|
        (capacity + 1).times do |w|
          if i == 0 || w == 0
            matrix[i][w] = 0
          elsif weights[i-1] > w
            matrix[i][w] = matrix[i-1][w]
          else
            with = matrix[i-1][w-weights[i-1]] + values[i-1]
            without = matrix[i-1][w]
            matrix[i][w] = [with, without].max
          end
        end
      end

      matrix[weights.length][capacity]
    end

    # weights = [1, 5, 10, 20, 30]
    # values = [1, 20, 60, 100, 120]
    # capacity = 50

    # puts knapsack(weights, values, capacity)

## Variation: Make Change

The Make Change problem is a variant of the Knapsack Problem, which takes an array of coin values and an amount of change, and returns the minimum number of coins needed to meet that amount. 

Really, the coins array can be thought of as items with value of 1. Thus, the problem becomes the knapsack problem, where instead of maximizing value, we minimize it.

Additionally, as opposed to the Knapsack problem, where each item may only be used once, each coin can be used multiple times.

Based on these two differences, the code for Make Change is slightly altered. However, one should still be able to see similarities with Knapsack in its implementation. Namely, a matrix is constructed with values on the x axis and items on the y axis. Values are computed based on previous values, with rules similar to the three described in Knapsack.

The completed code is as follows:

    def make_change(coins, change)
      matrix = Array.new(coins.length) { Array.new(change + 1) { 0 } }

      (coins.length).times do |i|
        (change + 1).times do |j|
          if i == 0 && coins[i] > j
            matrix[i][j] = -1
          elsif i == 0
            matrix[i][j] = [1, matrix[0][j-coins[0]] + 1].max
          elsif coins[i] > j
            matrix[i][j] = matrix[i-1][j]
          else
            with = [1, matrix[i][j-coins[i]] + 1].max
            without = matrix[i-1][j]
            matrix[i][j] = [with, without].min
          end
        end
        p matrix
      end

      matrix.last[change]
    end

## Variation: Subset Sum

The Subset Sum problem is actually a special case of the Knapsack Problem! It is simply a knapsack where the target is the capacity, and the items all have weights equal to their values.