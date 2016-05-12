# The Knuth-Morris-Pratt Algorithm

## Overview

KMP is a string-matching algorithm that optimizes finding the occurrence of a substring within another string by using characteristics of the substring to avoid re-examining seen characters. The algorithm can be used when the substring to be matched has an internally repetitive structure.

### Brute Force Solution

When searching for a substring within a string, a brute-force approach would be to maintain indices in the string and substring, and increment them every time there is a match. Upon a mismatch, the string's starting index is incremented by one, and both indices are reset to their starting points.

    abcabcabd abcabd
    ^         ^
    abcabcabd abcabd
     ^         ^
    abcabcabd abcabd
      ^         ^
    abcabcabd abcabd
       ^         ^
    abcabcabd abcabd
        ^         ^
    abcabcabd abcabd MISMATCH
         ^         ^
    abcabcabd abcabd MISMATCH
     ^        ^
    abcabcabd abcabd MISMATCH
      ^       ^
    abcabcabd abcabd
       ^      ^
    abcabcabd abcabd
        ^      ^
    abcabcabd abcabd
         ^      ^
    abcabcabd abcabd
          ^      ^
    abcabcabd abcabd
           ^      ^
    abcabcabd abcabd
            ^      ^


### KMP Solution

On the other hand, the KMP algorithm uses the fact that the substring has an internally repeating structure to calculate a "backtrack distance," such that upon a mismatch, instead of resetting to the start index, the current index of the string is moved back by the "backtrack distance." In the following example, upon finding a mismatch, backtrack distance at the letter "d" is checked, which turns out to be 2. Thus, the current index in the longer string moves back by 2 positions.

    abcabcabd abcabd
    ^         ^
    abcabcabd abcabd
     ^         ^
    abcabcabd abcabd
      ^         ^
    abcabcabd abcabd
       ^         ^
    abcabcabd abcabd
        ^         ^
    abcabcabd abcabd MISMATCH
         ^         ^
    abcabcabd abcabd
       ^      ^
    abcabcabd abcabd
        ^      ^
    abcabcabd abcabd
         ^      ^
    abcabcabd abcabd
          ^      ^
    abcabcabd abcabd
           ^      ^
    abcabcabd abcabd
            ^      ^

The logic of backtrack distances works as follows: in the substring `abcabd`, the letters `ab` are repeated. This means that in the process of matching, if the match fails on the last character, one still knows that `ab` was matched twice. Thus, the second `ab` in the longer string can be used as the starting point of the new match.

The KMP solution involves a helper function which calculates the backtrack distance for each position in the substring. Notably, no knowledge is needed of the longer string to calculate these distances -- as such, this information can be precomputed.