# Subset Sum

## Overview

Subset sum is a problem frequently encountered in interviews as a prototypical dynamic programming problem. It is a popular interview problem in part due to the amount of "twists" that can be applied to the problem, as well as the variety of approaches that can be taken to solve it. We will cover two variations of the problem, one trivial and one not.

## Trivial Case: Two Sum

### Problem

Given an array of nonnegative integers, write a function `two_sum` that takes a `target`, and returns `true` if two elements from the array can be added to reach the target.

### Brute Force Solution - `O(n^2)` time, `O(1)` space

We can solve this in `O(n^2 log n)` time simply by stepping through the array, subtracting each element from `target`, and doing a binary search for the result. If `target` - element exists in the array, return `true`. 

    class Array
      def two_sum(target)
        any? { |el| (self - [el]).include? target - el }
      end
    end

### Improved Solution - `O(n)` time, `O(n)` space

Instead of doing a binary search, we can simply record the difference in a set and, for each subsequent element, check if the element is present in the set. If so, then it is a complementary pair to a previously encountered element, and the target can be reached.

    class Array
      def two_sum(target)
        target_set = Set.new
        each { |el| target_set.include?(target - el) ? (return true) : target_set.add(el) }
        false
      end
    end

## Advanced Case: Subset Sum

### Problem

While `two_sum` is easy because we only need to consider two elements, `subset_sum` requires one to return `true` if ANY combination of elements can be combined to reach `target`. 

### Brute Force Solution - Power Set - `O(n 2**n)` time, `O(2**n)` space

The brute force solution would simply be to generate every possible subset, and then add them. In other words, we are generating the [power set](link) of the array.

Subsets can be generated thusly:

    class Array
      def power_set
        output = [[]]
        each do |n|
          output.concat output.map { |subset| subset + [n] }
        end
        output
      end

      def subset_sum(target)
        power_set.map { |subset| subset.reduce(:+) }.any? { |sum| sum == target }
      end
    end

`power_set` runs in exponential time, and generates a total of `2**n` subarrays. And then we need to iterate through each to search for the sum.

### Better Solution - Memoized Sum Table - `O(m*n)` time, `O(m*n)` space

Using dynamic programming, this problem can be solved in pseudo-polynomial time. The approach involves creating a table with every number from 0 to `target` as columns, and every item in the set as rows. Each row represents the set including the current row and all preceding rows, as well as all subsets. The table records which numbers can be achieved using elements from the subsets with `true` or `false`.

(Note that while it's easier to think about the problem in terms of sets, we're not truly working with sets as our array can have duplicates.)

Some general rules of the table:

1. If a sum can be reached by Set A, it can also be reached by any superset of Set A.
  * `[1, 2, 3]` can make `6`, so `[1, 2, 3, 4]` can also make `6`.
  * This means that a cell is `true` if the cell above it is `true`.
  * This also means once a cell is `true`, every cell below it will be `true` (as every subsequent row includes the current row as a subset).
2. Set A = Set B + some element. A sum can be reached by Set A if the sum - the added element can be reached by set B.
  * `[1, 2, 3]` can make `6`. `[1, 2, 3, 4]` adds `4` to the previous set, so `[1, 2, 3, 4]` can make `10`.
  * This means that in a row that adds element `n`, a cell is `true` if the cell one cell up and `n` cells to the left is `true`.

As such, the solution involves a helper function to generate the memoized table. `target` is then looked up, and if it is `true`, it can be reached.

    class Array
      def subset_sum(target)
        sum_table(target).last[target]
      end

      def sum_table(target)
        table = Array.new(length) { Array.new(target + 1) { false } }
        each_with_index do |el, i|
          (target + 1).times do |j|
            table[i][j] = true if el == j || table[i-1][j] || table[i-1][j-el]
          end
        end

        table
      end
    end

Note: For small numbers, this solution isn't necessarily better than the brute force solution. However, it is worth knowing that the subset sum problem is NP-hard, and the DP solution approximates polynomial time. Also, micro-optimizations can be implemented, like checking if the target is greater than the sum of all elements, and setting the length of the nested arrays to this max value. (Not implemented because I wanted my solution to be the most straightforward and readable.)

## Extra Advanced Case: Returning Subsets

Our current method returns a boolean. What if we actually wanted to retrieve every subset that summed to our target?

Take a look at the output of `#sum_table`, and at the third clause in the `if` statement. Basically, a value is achievable in a set if the value minus the added element is achievable in a previous subset. Additionally, the second clause says that achievable values 'cascade' downwards -- any superset of a set that can achieve a target can achieve the same target.

This means that by backtracking through our table, we can reconstruct the subsets that achieve `target`. Starting from the bottom right cell, we step left `n` steps, where `n` is the last value in the last set. This gives us the sum that was used to reach `target` by adding an additional element. 

To find which value was actually used in this set, we can look upwards until we find a cell that is `false`. Remember, `true`s cascade, so the first occurrence of `true` marks the first element that is crucial to achieve a sum. 

Thus, to generate subsets, we start, in reverse order, at each row whose `target`-th column is `true`. We then step left `n` times, where `n` is the value represented by the row, and then step up until we reach the first occurrence of `true`. We push all these 'crucial' elements into an array, and then return these arrays.