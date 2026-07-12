export interface Problem {
  id: string;
  name: string;
  difficulty: "Easy" | "Medium" | "Hard";
  platform: "LeetCode" | "GFG" | "Codeforces";
  url: string;
  isPremium?: boolean;
  topics?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  prerequisites?: string[];
  templateCode?: string;
  templateCodeCpp?: string;
  problems: Problem[];
}

export const dsaPatterns: Pattern[] = [
  {
    id: "trees",
    name: "Trees",
    description: "Hierarchical traversals (DFS/BFS), binary search tree algorithms, and parent-child tracking.",
    prerequisites: ["Recursion", "Stack & Queues", "Basic Tree Definitions"],
    templateCode: `# Template: DFS Traversal (Post-order example)
def dfs(root):
    if not root:
        return 0
    left = dfs(root.left)
    right = dfs(root.right)
    # Process logic (height, diameter, balanced bounds)
    return 1 + max(left, right)`,
    templateCodeCpp: `// Template: DFS Traversal (Post-order example)
int dfs(TreeNode* root) {
    if (!root) return 0;
    int left = dfs(root->left);
    int right = dfs(root->right);
    // Process logic (height, diameter, balanced bounds)
    return 1 + max(left, right);
}`,
    problems: [
      { id: "invert-binary-tree", name: "Invert Binary Tree", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/invert-binary-tree/", topics: "Master how depth-first search (DFS) post-order traversal works to swap left and right child pointers recursively at each node.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "max-depth-binary-tree", name: "Maximum Depth of Binary Tree", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/", topics: "Understand post-order DFS to calculate max depth at children and return (1 + max(left_depth, right_depth)) to parent.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "diameter-binary-tree", name: "Diameter of Binary Tree", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/diameter-of-binary-tree/", topics: "Learn how to compute node height recursively while updating a global max for (left_height + right_height) at each node.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "balanced-binary-tree", name: "Balanced Binary Tree", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/balanced-binary-tree/", topics: "Study how to bubble up -1 when a subtree's heights differ by > 1 to avoid redundant top-down recursion checks.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "same-tree", name: "Same Tree", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/same-tree/", topics: "Practice checking node value equality recursively and validating that both left subtrees and right subtrees match.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "subtree-another-tree", name: "Subtree of Another Tree", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/subtree-of-another-tree/", topics: "Learn how to combine a recursive subtree check helper with standard root equality checks.", timeComplexity: "O(N*M)", spaceComplexity: "O(N)" },
      { id: "lowest-common-ancestor-bst", name: "Lowest Common Ancestor of a BST", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/", topics: "Use BST properties: if target values are both smaller than current node, traverse left; if larger, traverse right; otherwise, current node is LCA.", timeComplexity: "O(H)", spaceComplexity: "O(H)" },
      { id: "binary-tree-level-order", name: "Binary Tree Level Order Traversal", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/", topics: "Master BFS using a queue while capturing the queue size at the start of each level to group node values.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "validate-bst", name: "Validate Binary Search Tree", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/validate-binary-search-tree/", topics: "Understand how to pass dynamic boundary constraints (min, max) down to recursive child calls to ensure values sit correctly.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "kth-smallest-bst", name: "Kth Smallest Element in a BST", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/kth-smallest-element-in-a-bst/", topics: "Learn how an inorder traversal (Left-Root-Right) visits a BST in sorted ascending order, and stop at the K-th count.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "construct-preorder-inorder", name: "Construct Binary Tree from Preorder and Inorder Traversal", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/", topics: "Study how the preorder list determines the root node and the inorder list splits left and right subtrees using hash lookup.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "binary-tree-max-path-sum", name: "Binary Tree Maximum Path Sum", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/binary-tree-max-path-sum/", topics: "Master computing the maximum single-path sum recursively for a subtree while updating a global max that combines both child paths.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "serialize-deserialize-binary-tree", name: "Serialize and Deserialize Binary Tree", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/", topics: "Understand how preorder DFS string joins (delimiting nulls with '#') preserve tree structure for easy parsing.", timeComplexity: "O(N)", spaceComplexity: "O(N)" }
    ]
  },
  {
    id: "graphs",
    name: "Graphs (BFS/DFS/Union-Find)",
    description: "Node connections, pathfinding, topological sorting, and cycle checks in networks.",
    prerequisites: ["Recursion", "Trees (DFS/BFS)", "Stack & Queues", "Adjacency List/Matrix"],
    templateCode: `# Template: BFS Shortest Path Traversal
from collections import deque
def bfs(start_node, graph):
    queue = deque([start_node])
    visited = {start_node}
    while queue:
        node = queue.popleft()
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)`,
    templateCodeCpp: `// Template: BFS Shortest Path Traversal
void bfs(int start, const vector<vector<int>>& adj) {
    queue<int> q;
    vector<bool> visited(adj.size(), false);
    q.push(start);
    visited[start] = true;
    while (!q.empty()) {
        int node = q.front(); q.pop();
        for (int neighbor : adj[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                q.push(neighbor);
            }
        }
    }
}`,
    problems: [
      { id: "number-of-islands", name: "Number of Islands", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/number-of-islands/", topics: "Study grid DFS traversal to sink connected '1's into '0's when counting disjoint land components.", timeComplexity: "O(R*C)", spaceComplexity: "O(R*C)" },
      { id: "clone-graph", name: "Clone Graph", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/clone-graph/", topics: "Learn how to traverse a graph using BFS/DFS while maintaining a hash map of original-to-clone nodes to prevent cycles.", timeComplexity: "O(V+E)", spaceComplexity: "O(V)" },
      { id: "course-schedule", name: "Course Schedule", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/course-schedule/", topics: "Master topological sorting (Kahn's BFS using in-degrees or DFS cycle detection) to verify if courses have mutually dependent loops.", timeComplexity: "O(V+E)", spaceComplexity: "O(V+E)" },
      { id: "pacific-atlantic-flow", name: "Pacific Atlantic Water Flow", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/", topics: "Study how to run DFS backward from the ocean shore boundaries inward to find cells reachable by both oceans.", timeComplexity: "O(R*C)", spaceComplexity: "O(R*C)" },
      { id: "rotting-oranges", name: "Rotting Oranges", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/rotting-oranges/", topics: "Master multi-source BFS by loading all starting rot centers into a queue to process level-by-level distance updates.", timeComplexity: "O(R*C)", spaceComplexity: "O(R*C)" },
      { id: "graph-valid-tree", name: "Graph Valid Tree", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/graph-valid-tree/", isPremium: true, topics: "Learn how a tree must have exactly N-1 edges and no cycles, verified via BFS cycle tracking or Union-Find.", timeComplexity: "O(V+E)", spaceComplexity: "O(V+E)" },
      { id: "connected-components-undirected", name: "Number of Connected Components in an Undirected Graph", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/", isPremium: true, topics: "Understand how Union-Find tracks connected components or run BFS/DFS on unvisited nodes to count disconnected components.", timeComplexity: "O(V+E)", spaceComplexity: "O(V)" },
      { id: "redundant-connection", name: "Redundant Connection (Union-Find)", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/redundant-connection/", topics: "Master Union-Find with path compression to detect the first edge that connects two nodes already belonging to the same set.", timeComplexity: "O(V * alpha(V))", spaceComplexity: "O(V)" },
      { id: "word-ladder", name: "Word Ladder", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/word-ladder/", topics: "Study shortest-path BFS to traverse word mutations, replacing each char to find valid path transitions.", timeComplexity: "O(M^2 * N)", spaceComplexity: "O(M^2 * N)" },
      { id: "dijkstras-shortest-path", name: "Dijkstra's Shortest Path", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/dijkstras-shortest-path-algorithm-greedy-algo-7/", topics: "Master using a priority queue (Min-heap) to greedily pull the node with the absolute minimum distance to find shortest paths.", timeComplexity: "O(E log V)", spaceComplexity: "O(V)" },
      { id: "alien-dictionary", name: "Alien Dictionary (topological sort)", difficulty: "Hard", platform: "GFG", url: "https://www.geeksforgeeks.org/given-sorted-dictionary-of-an-alien-language-find-order-of-characters/", topics: "Learn how to compare adjacent words character-by-character to establish precedence edges and run topological sorting.", timeComplexity: "O(V+E)", spaceComplexity: "O(V+E)" },
      { id: "bellman-ford", name: "Bellman-Ford Algorithm", difficulty: "Medium", platform: "Codeforces", url: "https://cp-algorithms.com/graph/bellman_ford.html", topics: "Understand Bellman-Ford's edge relaxation logic to find shortest paths in the presence of negative edge weights.", timeComplexity: "O(V*E)", spaceComplexity: "O(V)" }
    ]
  },
  {
    id: "dynamic-programming",
    name: "Dynamic Programming",
    description: "Resolving overlapping subproblems by storing intermediate computed states (memoization/tabulation).",
    prerequisites: ["Recursion", "Memoization", "Arrays & 2D Grid Traversals"],
    templateCode: `# Template: 1D / 2D Tabulation (Coin Change / LCS example)
def dp_tabulation(items, target):
    dp = [float('inf')] * (target + 1)
    dp[0] = 0
    for i in range(1, target + 1):
        for item in items:
            if i - item >= 0:
                dp[i] = min(dp[i], 1 + dp[i - item])
    return dp[target]`,
    templateCodeCpp: `// Template: 1D / 2D Tabulation (Coin Change / LCS example)
int dp_tabulation(const vector<int>& items, int target) {
    vector<int> dp(target + 1, 1e9);
    dp[0] = 0;
    for (int i = 1; i <= target; ++i) {
        for (int item : items) {
            if (i - item >= 0) {
                dp[i] = min(dp[i], 1 + dp[i - item]);
            }
        }
    }
    return dp[target];
}`,
    problems: [
      { id: "climbing-stairs", name: "Climbing Stairs", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/climbing-stairs/", topics: "Study how the number of ways to reach step N is the sum of ways to reach (N-1) and (N-2), matching the Fibonacci sequence.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "house-robber", name: "House Robber", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/house-robber/", topics: "Understand the DP state transition: max profit at house N is max(rob house N + profit at N-2, skip house N and take profit at N-1).", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "house-robber-ii", name: "House Robber II", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/house-robber-ii/", topics: "Learn how to split a circular array into two linear sub-arrays (houses 0 to N-2 and houses 1 to N-1) and run standard House Robber.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "longest-increasing-subsequence", name: "Longest Increasing Subsequence", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/longest-increasing-subsequence/", topics: "Study dynamic programming transition or optimize to O(N log N) using binary search (patience sorting) to maintain LIS ends.", timeComplexity: "O(N log N)", spaceComplexity: "O(N)" },
      { id: "coin-change", name: "Coin Change", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/coin-change/", topics: "Understand how to build a 1D DP table tracking minimum coins needed for each amount from 1 to target.", timeComplexity: "O(N * A)", spaceComplexity: "O(A)" },
      { id: "longest-common-subsequence", name: "Longest Common Subsequence", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/longest-common-subsequence/", topics: "Master building a 2D grid where grid[i][j] is 1 + grid[i-1][j-1] if characters match, else max(grid[i-1][j], grid[i][j-1]).", timeComplexity: "O(N * M)", spaceComplexity: "O(N * M)" },
      { id: "word-break", name: "Word Break", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/word-break/", topics: "Study how dp[i] is true if a prefix dp[j] is true and substring j-to-i exists in the word dictionary.", timeComplexity: "O(N^3)", spaceComplexity: "O(N)" },
      { id: "partition-equal-subset-sum", name: "Partition Equal Subset Sum", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/partition-equal-subset-sum/", topics: "Learn how to check if a subset sum equal to sum(array) / 2 exists using a 1D DP boolean array.", timeComplexity: "O(N * S)", spaceComplexity: "O(S)" },
      { id: "unique-paths", name: "Unique Paths", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/unique-paths/", topics: "Understand how to populate a grid where path count at (r, c) is grid[r-1][c] + grid[r][c-1].", timeComplexity: "O(R * C)", spaceComplexity: "O(R * C)" },
      { id: "decode-ways", name: "Decode Ways", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/decode-ways/", topics: "Learn how to check if 1-digit and 2-digit groups form valid numbers between 1 and 26 to transition DP state paths.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "edit-distance", name: "Edit Distance", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/edit-distance/", topics: "Study 2D grid DP transition: if chars differ, cell value is 1 + min(insert path, delete path, replace path).", timeComplexity: "O(N * M)", spaceComplexity: "O(N * M)" },
      { id: "max-product-subarray", name: "Maximum Product Subarray", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/maximum-product-subarray/", topics: "Understand how to maintain both min_product and max_product at each step since multiplying a negative number by another negative number can yield a max product.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "target-sum", name: "Target Sum", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/target-sum/", topics: "Learn how to mathematically convert the plus/minus target matching problem into a standard subset sum partition problem.", timeComplexity: "O(N * S)", spaceComplexity: "O(S)" },
      { id: "zero-one-knapsack", name: "0/1 Knapsack", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/", topics: "Master how to construct a 2D state transition table evaluating maximum values obtained by choosing or skipping item weights.", timeComplexity: "O(N * W)", spaceComplexity: "O(N * W)" }
    ]
  },
  {
    id: "sliding-window",
    name: "Sliding Window",
    description: "Maintaining a subsegment of elements dynamically to track range properties.",
    prerequisites: ["Arrays & Hashing", "Two Pointers", "Subarrays"],
    templateCode: `# Template: Variable-Size Sliding Window
def sliding_window(arr, condition):
    left = 0
    result = 0
    state = {}
    for right in range(len(arr)):
        # Add arr[right] to state
        while condition_violated(state):
            # Remove arr[left] from state
            left += 1
        # Update dynamic range result
        result = max(result, right - left + 1)
    return result`,
    templateCodeCpp: `// Template: Variable-Size Sliding Window
int sliding_window(const vector<int>& arr) {
    int left = 0, result = 0;
    unordered_map<int, int> state;
    for (int right = 0; right < arr.size(); ++right) {
        // Add arr[right] to state
        while (condition_violated(state)) {
            // Remove arr[left] from state
            left++;
        }
        // Update dynamic range result
        result = max(result, right - left + 1);
    }
    return result;
}`,
    problems: [
      { id: "best-time-to-buy-stock", name: "Best Time to Buy and Sell Stock", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/", topics: "Study how to track the minimum price seen so far as you iterate, and calculate profit margins against it.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "longest-substring-without-repeating", name: "Longest Substring Without Repeating Characters", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/", topics: "Learn how to use a sliding window with a map that stores character indices to contract the window starting boundary dynamically.", timeComplexity: "O(N)", spaceComplexity: "O(K)" },
      { id: "longest-repeating-character-replacement", name: "Longest Repeating Character Replacement", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/longest-repeating-character-replacement/", topics: "Master tracking the frequency of the most common character in the sliding window, expanding the window until (length - max_freq) > K.", timeComplexity: "O(N)", spaceComplexity: "O(26)" },
      { id: "permutation-in-string", name: "Permutation in String", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/permutation-in-string/", topics: "Understand how to maintain two character frequency arrays for a sliding window of fixed length equal to string S1.", timeComplexity: "O(N)", spaceComplexity: "O(26)" },
      { id: "minimum-window-substring", name: "Minimum Window Substring", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/minimum-window-substring/", topics: "Study how to contract a sliding window containing all target chars, checking character count hashes against the target string S.", timeComplexity: "O(N)", spaceComplexity: "O(K)" },
      { id: "sliding-window-maximum", name: "Sliding Window Maximum", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/sliding-window-maximum/", topics: "Master using a monotonic queue (deque) to store indices in decreasing element order, keeping the max element index at the head.", timeComplexity: "O(N)", spaceComplexity: "O(K)" },
      { id: "max-consecutive-ones-iii", name: "Max Consecutive Ones III", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/max-consecutive-ones-iii/", topics: "Learn how to expand a sliding window while counting zero flips, contracting the left pointer when flip count exceeds K.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "fruit-into-baskets", name: "Fruit Into Baskets", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/fruit-into-baskets/", topics: "Study sliding windows to track subarray ranges containing at most 2 distinct elements using a frequency map.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "max-sum-subarray-k", name: "Maximum Sum Subarray of Size K", difficulty: "Easy", platform: "GFG", url: "https://www.geeksforgeeks.org/window-sliding-technique/", topics: "Learn how to add the incoming element and subtract the outgoing element to calculate the rolling sum of a fixed window size K.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "smallest-subarray-greater-x", name: "Smallest Subarray with Sum Greater than X", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/minimum-length-subarray-sum-greater-given-value/", topics: "Master sliding windows to shrink the window starting boundary while the current window sum is greater than target X.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "count-nice-subarrays", name: "Count Number of Nice Subarrays", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/count-number-of-nice-subarrays/", topics: "Understand how to map this to finding subarrays with sum equal to K by converting odd numbers to 1s and evens to 0s.", timeComplexity: "O(N)", spaceComplexity: "O(1)" }
    ]
  },
  {
    id: "two-pointers",
    name: "Two Pointers",
    description: "Iterating elements from both ends or distinct rates to solve sorted/un-sorted arrays.",
    prerequisites: ["Arrays & Hashing", "Linear Traversal"],
    templateCode: `# Template: Two Pointers (Sorted array checks)
def two_pointers(arr, target):
    left, right = 0, len(arr) - 1
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1
        else:
            right -= 1
    return []`,
    templateCodeCpp: `// Template: Two Pointers (Sorted array checks)
vector<int> two_pointers(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) return {left, right};
        else if (sum < target) left++;
        else right--;
    }
    return {};
}`,
    problems: [
      { id: "valid-palindrome", name: "Valid Palindrome", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/valid-palindrome/", topics: "Practice moving two pointers from the outer ends inward, skipping non-alphanumeric characters, and comparing characters.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "two-sum-ii", name: "Two Sum II (sorted array)", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/", topics: "Use two pointers on a sorted array: increment the left pointer if the sum is too small; decrement the right pointer if too large.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "three-sum", name: "3Sum", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/3sum/", topics: "Sort the array, iterate with a fixed first element, and run Two Pointers (Two Sum II) on the remaining elements, skipping duplicate values.", timeComplexity: "O(N^2)", spaceComplexity: "O(1)" },
      { id: "container-with-most-water", name: "Container With Most Water", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/container-with-most-water/", topics: "Start pointers at both ends and compute container volume, then greedily advance the pointer pointing to the shorter vertical bar.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "trapping-rain-water", name: "Trapping Rain Water", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/trapping-rain-water/", topics: "Study how the trapped water at cell I is determined by min(max_left, max_right) - height[i], tracked using two boundary pointers.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "remove-duplicates-sorted", name: "Remove Duplicates from Sorted Array", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/remove-duplicates-from-sorted-array/", topics: "Use a slow-write pointer and a fast-read pointer to overwrite duplicates in-place on a sorted array.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "sort-colors", name: "Sort Colors (Dutch National Flag)", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/sort-colors/", topics: "Master the 3-pointer Dutch National Flag partition, swapping 0s to the left pointer, 2s to the right pointer, and iterating with a middle pointer.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "squares-sorted-array", name: "Squares of a Sorted Array", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/squares-of-a-sorted-array/", topics: "Compare absolute values at both ends using two pointers, writing the larger squared value to the end of the output array.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "merge-sorted-array", name: "Merge Sorted Array", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/merge-sorted-array/", topics: "Avoid moving elements by starting two pointers at the end of S1 and S2, and writing the larger element from the back of the merged array.", timeComplexity: "O(N + M)", spaceComplexity: "O(1)" },
      { id: "boats-to-save-people", name: "Boat to Save People", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/boats-to-save-people/", topics: "Sort the array and pair the heaviest person (right pointer) with the lightest person (left pointer) if their combined weight fits.", timeComplexity: "O(N log N)", spaceComplexity: "O(1)" },
      { id: "pair-with-given-sum", name: "Pair with given sum in sorted array", difficulty: "Easy", platform: "GFG", url: "https://www.geeksforgeeks.org/two-elements-whose-sum-is-closest-to-zero/", topics: "Iterate pointers from both ends of a sorted array, shifting inward based on sum comparisons.", timeComplexity: "O(N)", spaceComplexity: "O(1)" }
    ]
  },
  {
    id: "heaps-priority-queues",
    name: "Heaps & Priority Queues",
    description: "Min/Max heaps for immediate access to extrema values in stream or collection processing.",
    prerequisites: ["Binary Trees", "Array Representation of Trees", "Sorting"],
    templateCode: `# Template: K-th Extrema stream tracking
import heapq
def track_kth_largest(stream, k):
    min_heap = []
    for num in stream:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]`,
    templateCodeCpp: `// Template: K-th Extrema stream tracking
int track_kth_largest(const vector<int>& stream, int k) {
    priority_queue<int, vector<int>, greater<int>> min_heap;
    for (int num : stream) {
        min_heap.push(num);
        if (min_heap.size() > k) {
            min_heap.pop();
        }
    }
    return min_heap.top();
}`,
    problems: [
      { id: "kth-largest-stream", name: "Kth Largest Element in a Stream", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/", topics: "Maintain a Min-heap of size K; when a new value arrives, push it, and pop the min value so the heap root is always the K-th largest.", timeComplexity: "O(log K)", spaceComplexity: "O(K)" },
      { id: "last-stone-weight", name: "Last Stone Weight", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/last-stone-weight/", topics: "Use a Max-heap to repeatedly extract the two absolute heaviest stones, crash them, and push the remainder back.", timeComplexity: "O(N log N)", spaceComplexity: "O(N)" },
      { id: "k-closest-points", name: "K Closest Points to Origin", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/k-closest-points-to-origin/", topics: "Maintain a Max-heap of size K storing points sorted by distance; when size exceeds K, pop the maximum distance node.", timeComplexity: "O(N log K)", spaceComplexity: "O(K)" },
      { id: "kth-largest-array", name: "Kth Largest Element in an Array", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/", topics: "Solve in O(N) average time using Quickselect (partitioning), or maintain a Min-heap of size K.", timeComplexity: "O(N)", spaceComplexity: "O(K)" },
      { id: "task-scheduler", name: "Task Scheduler", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/task-scheduler/", topics: "Load task frequencies into a Max-heap and pop tasks during intervals, placing partially used tasks on a cool-down queue.", timeComplexity: "O(N)", spaceComplexity: "O(26)" },
      { id: "design-twitter", name: "Design Twitter", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/design-twitter/", topics: "Use a Max-heap to merge K-sorted lists of user tweets in reverse chronological order, tracking follower maps via hash sets.", timeComplexity: "O(N log K)", spaceComplexity: "O(U + T)" },
      { id: "find-median-data-stream", name: "Find Median from Data Stream", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/find-median-from-data-stream/", topics: "Maintain a Max-heap for the lower half of numbers and a Min-heap for the upper half, balancing sizes to lookup medians in O(1).", timeComplexity: "O(log N)", spaceComplexity: "O(N)" },
      { id: "merge-k-sorted-lists-heap", name: "Merge K Sorted Lists (heap approach)", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/merge-k-sorted-lists/", topics: "Push the head nodes of all K lists into a Min-heap, and recursively link the popped node to the result list while pushing its successor.", timeComplexity: "O(N log K)", spaceComplexity: "O(K)" },
      { id: "top-k-frequent-words", name: "Top K Frequent Words", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/top-k-frequent-words/", topics: "Load frequency counts into a Min-heap using a custom string comparator to resolve lexicographical tie-breakers.", timeComplexity: "O(N log K)", spaceComplexity: "O(N)" },
      { id: "connect-ropes-min-cost", name: "Connect Ropes to Minimize Cost", difficulty: "Easy", platform: "GFG", url: "https://www.geeksforgeeks.org/connect-n-ropes-minimum-cost/", topics: "Greedily pop the two shortest ropes from a Min-heap, add them together, count the cost, and push the combined rope back.", timeComplexity: "O(N log N)", spaceComplexity: "O(N)" }
    ]
  },
  {
    id: "backtracking",
    name: "Backtracking",
    description: "Systematic building, testing, and discarding of path options (recursion + state restoration).",
    prerequisites: ["Recursion (Base Cases & Choices)", "Call Stack Concepts"],
    templateCode: `# Template: DFS Combinatorial Backtracking
def backtrack(start_index, path, result):
    if base_case_met:
        result.append(list(path))
        return
    for i in range(start_index, len(candidates)):
        # 1. Choose state
        path.append(candidates[i])
        # 2. Recurse
        backtrack(i + 1, path, result)
        # 3. Restore state (backtrack)
        path.pop()`,
    templateCodeCpp: `// Template: DFS Combinatorial Backtracking
void backtrack(int start, vector<int>& path, vector<vector<int>>& result, const vector<int>& candidates) {
    if (base_case_met()) {
        result.push_back(path);
        return;
    }
    for (int i = start; i < candidates.size(); ++i) {
        // 1. Choose state
        path.push_back(candidates[i]);
        // 2. Recurse
        backtrack(i + 1, path, result, candidates);
        // 3. Restore state (backtrack)
        path.pop_back();
    }
}`,
    problems: [
      { id: "subsets", name: "Subsets", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/subsets/", topics: "For each element, choose to either include it or exclude it from the subset, using recursion to build the full tree.", timeComplexity: "O(N * 2^N)", spaceComplexity: "O(N)" },
      { id: "combination-sum", name: "Combination Sum", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/combination-sum/", topics: "Perform DFS backtracking where you recursively subtract the current element from the target, allowing reuse of the same index.", timeComplexity: "O(2^T)", spaceComplexity: "O(T)" },
      { id: "permutations", name: "Permutations", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/permutations/", topics: "Generate arrangements by either swapping elements recursively or keeping track of visited elements using a boolean mask.", timeComplexity: "O(N * N!)", spaceComplexity: "O(N)" },
      { id: "subsets-ii", name: "Subsets II", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/subsets-ii/", topics: "Sort the input array first, and during backtracking decisions, skip consecutive duplicate elements if you choose to exclude them.", timeComplexity: "O(N * 2^N)", spaceComplexity: "O(N)" },
      { id: "word-search", name: "Word Search", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/word-search/", topics: "Run grid DFS backtracking from each cell, marking visited cells with a temporary character mask and resetting it on exit.", timeComplexity: "O(R * C * 4^L)", spaceComplexity: "O(L)" },
      { id: "palindrome-partitioning", name: "Palindrome Partitioning", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/palindrome-partitioning/", topics: "Recursively partition prefixes of the string, check if the prefix is a palindrome, and backtrack to find all valid combinations.", timeComplexity: "O(N * 2^N)", spaceComplexity: "O(N)" },
      { id: "letter-combinations-phone", name: "Letter Combinations of a Phone Number", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/", topics: "Map digits to letters, and run DFS backtracking to build strings, appending characters step-by-step.", timeComplexity: "O(3^N * 4^M)", spaceComplexity: "O(N + M)" },
      { id: "n-queens", name: "N-Queens", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/n-queens/", topics: "Place queens row-by-row while tracking invalid columns, positive diagonals (r + c), and negative diagonals (r - c) in hash sets.", timeComplexity: "O(N!)", spaceComplexity: "O(N)" },
      { id: "sudoku-solver", name: "Sudoku Solver", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/sudoku-solver/", topics: "Solve with backtracking: try digits 1-9 in empty cells, check row/column/box constraints, and revert if you encounter an invalid state.", timeComplexity: "O(9^(N^2))", spaceComplexity: "O(N^2)" },
      { id: "rat-in-maze", name: "Rat in a Maze", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/rat-in-a-maze-backtracking-2/", topics: "Run DFS from the maze entry cell, marking path cells as visited and backing out if you hit a dead end.", timeComplexity: "O(4^(N^2))", spaceComplexity: "O(N^2)" },
      { id: "combination-sum-ii", name: "Combination Sum II", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/combination-sum-ii/", topics: "Sort the array, deduct elements recursively, and skip adjacent duplicate elements at the same decision level.", timeComplexity: "O(2^N)", spaceComplexity: "O(N)" }
    ]
  },
  {
    id: "advanced-graphs",
    name: "Advanced Graphs",
    description: "Shortest paths (Dijkstra), minimum spanning trees (Prim/Kruskal), and network flows.",
    prerequisites: ["Basic Graphs (BFS/DFS)", "Heaps & Priority Queues", "Greedy Algorithms"],
    templateCode: `# Template: Dijkstra's Shortest Path Algorithm
import heapq
def dijkstra(start, graph):
    min_heap = [(0, start)] # (distance, node)
    distances = {start: 0}
    while min_heap:
        d, node = heapq.heappop(min_heap)
        if d > distances.get(node, float('inf')):
            continue
        for neighbor, weight in graph[node]:
            if d + weight < distances.get(neighbor, float('inf')):
                distances[neighbor] = d + weight
                heapq.heappush(min_heap, (d + weight, neighbor))
    return distances`,
    templateCodeCpp: `// Template: Dijkstra's Shortest Path Algorithm
vector<int> dijkstra(int start, const vector<vector<pair<int, int>>>& adj) {
    vector<int> dist(adj.size(), 1e9);
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> min_heap;
    dist[start] = 0;
    min_heap.push({0, start}); // {distance, node}
    while (!min_heap.empty()) {
        auto [d, node] = min_heap.top(); min_heap.pop();
        if (d > dist[node]) continue;
        for (auto& [neighbor, weight] : adj[node]) {
            if (d + weight < dist[neighbor]) {
                dist[neighbor] = d + weight;
                min_heap.push({dist[neighbor], neighbor});
            }
        }
    }
    return dist;
}`,
    problems: [
      { id: "network-delay-time", name: "Network Delay Time", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/network-delay-time/", topics: "Run Dijkstra's shortest path from the start node, maintaining a Min-heap of (distance, node) to update path times.", timeComplexity: "O(E log V)", spaceComplexity: "O(V)" },
      { id: "min-cost-connect-points", name: "Min Cost to Connect All Points", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/min-cost-connect-points/", topics: "Construct a Minimum Spanning Tree using Prim's algorithm (priority queue) or Kruskal's algorithm (sorting edges + Union-Find).", timeComplexity: "O(V^2 log V)", spaceComplexity: "O(V)" },
      { id: "swim-in-rising-water", name: "Swim in Rising Water", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/swim-in-rising-water/", topics: "Find a path where the maximum cell elevation is minimized, solved using a modified Dijkstra priority queue.", timeComplexity: "O(N^2 log N)", spaceComplexity: "O(N^2)" },
      { id: "reconstruct-itinerary", name: "Reconstruct Itinerary", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/reconstruct-itinerary/", topics: "Find an Eulerian path using Hierholzer's DFS traversal, building the itinerary in reverse order from destination to source.", timeComplexity: "O(E log E)", spaceComplexity: "O(V+E)" },
      { id: "cheapest-flights-k-stops", name: "Cheapest Flights Within K Stops", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/", topics: "Run Dijkstra or Bellman-Ford for K iterations, maintaining intermediate path arrays to limit the number of stops.", timeComplexity: "O(K * E)", spaceComplexity: "O(V)" }
    ]
  },
  {
    id: "intervals",
    name: "Intervals",
    description: "Processing overlapping ranges, schedules, and start-end coordinates.",
    prerequisites: ["Sorting (Custom Comparators)", "Arrays & Hashing"],
    templateCode: `# Template: Intervals Overlaps check
def merge_intervals(intervals):
    intervals.sort(key=lambda x: x[0])
    merged = []
    for interval in intervals:
        if not merged or merged[-1][1] < interval[0]:
            merged.append(interval)
        else:
            merged[-1][1] = max(merged[-1][1], interval[1])
    return merged`,
    templateCodeCpp: `// Template: Intervals Overlaps check
vector<vector<int>> merge_intervals(vector<vector<int>>& intervals) {
    if (intervals.empty()) return {};
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> merged;
    for (const auto& interval : intervals) {
        if (merged.empty() || merged.back()[1] < interval[0]) {
            merged.push_back(interval);
        } else {
            merged.back()[1] = max(merged.back()[1], interval[1]);
        }
    }
    return merged;
}`,
    problems: [
      { id: "meeting-rooms", name: "Meeting Rooms", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/meeting-rooms/", isPremium: true, topics: "Sort intervals by start times, then verify that the end time of each meeting is less than or equal to the start time of the next.", timeComplexity: "O(N log N)", spaceComplexity: "O(1)" },
      { id: "meeting-rooms-ii", name: "Meeting Rooms II", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/meeting-rooms-ii/", isPremium: true, topics: "Sort meetings, then maintain active meeting end times in a Min-heap, checking if the heap size represents the minimum rooms required.", timeComplexity: "O(N log N)", spaceComplexity: "O(N)" }
    ]
  },
  {
    id: "tries",
    name: "Tries",
    description: "Prefix tree structures optimized for character-level matching, retrieval, and auto-complete.",
    prerequisites: ["Trees (Node Children Concepts)", "String Properties", "Recursion"],
    templateCode: `# Template: Trie Node Class insertion
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_word = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    def insert(self, word):
        curr = self.root
        for char in word:
            if char not in curr.children:
                curr.children[char] = TrieNode()
            curr = curr.children[char]
        curr.is_word = True`,
    templateCodeCpp: `// Template: Trie Node Class insertion
class TrieNode {
public:
    TrieNode* children[26] = {nullptr};
    bool is_word = false;
};

class Trie {
private:
    TrieNode* root = new TrieNode();
public:
    void insert(string word) {
        TrieNode* curr = root;
        for (char c : word) {
            if (!curr->children[c - 'a']) {
                curr->children[c - 'a'] = new TrieNode();
            }
            curr = curr->children[c - 'a'];
        }
        curr->is_word = true;
    }
};`,
    problems: [
      { id: "implement-trie", name: "Implement Trie (Prefix Tree)", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/implement-trie-prefix-tree/", topics: "Build a tree structure where each node has a map or array of 26 children references and a boolean flag marking end of word.", timeComplexity: "O(L)", spaceComplexity: "O(T)" },
      { id: "design-add-search-words", name: "Design Add and Search Words Data Structure", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/design-add-search-words-data-structure/", topics: "Store words in a Trie; when matching the wildcard '.', run recursive DFS search on all children nodes.", timeComplexity: "O(L)", spaceComplexity: "O(T)" },
      { id: "word-search-ii", name: "Word Search II", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/word-search-ii/", topics: "Load the dictionary into a Trie, and run grid DFS traversal, pruning search paths early if the character path is not a Trie prefix.", timeComplexity: "O(R * C * 4^L)", spaceComplexity: "O(T + R*C)" },
      { id: "longest-common-prefix", name: "Longest Common Prefix", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/longest-common-prefix/", topics: "Build a Trie from the strings and walk down the linear prefix root until a node branching occurred.", timeComplexity: "O(S)", spaceComplexity: "O(S)" },
      { id: "search-query-autocomplete", name: "Search Query Auto-complete", difficulty: "Hard", platform: "GFG", url: "https://www.geeksforgeeks.org/search-query-auto-complete-structure-trie/", topics: "Maintain user input characters in a Trie, storing sentence frequencies on Trie leaves and querying them using a Min-heap.", timeComplexity: "O(L)", spaceComplexity: "O(T)" }
    ]
  },
  {
    id: "monotonic-stack",
    name: "Monotonic Stack",
    description: "Maintains elements in a sorted stack order to answer range queries in linear time.",
    prerequisites: ["Stacks", "Arrays & Hashing"],
    templateCode: `# Template: Next Greater Element using monotonic stack
def next_greater(arr):
    stack = [] # indices in decreasing element values
    res = [-1] * len(arr)
    for i in range(len(arr)):
        while stack and arr[stack[-1]] < arr[i]:
            prev_idx = stack.pop()
            res[prev_idx] = arr[i]
        stack.append(i)
    return res`,
    templateCodeCpp: `// Template: Next Greater Element using monotonic stack
vector<int> next_greater(const vector<int>& arr) {
    stack<int> s; // stores indices
    vector<int> res(arr.size(), -1);
    for (int i = 0; i < arr.size(); ++i) {
        while (!s.empty() && arr[s.top()] < arr[i]) {
            int prev_idx = s.top(); s.pop();
            res[prev_idx] = arr[i];
        }
        s.push(i);
    }
    return res;
}`,
    problems: [
      { id: "next-greater-element-ii", name: "Next Greater Element II", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/next-greater-element-ii/", topics: "Iterate circular index boundaries via (I % N) twice while maintaining a monotonic decreasing stack of indices.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "online-stock-span", name: "Online Stock Span", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/online-stock-span/", topics: "Pop price indices from a monotonic decreasing stack when the incoming stream price is larger, summing spans.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "next-smaller-element", name: "Next Smaller Element", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/next-smaller-element/", topics: "Maintain a monotonic increasing stack to find the first smaller element on the right side of each item.", timeComplexity: "O(N)", spaceComplexity: "O(N)" }
    ]
  },
  {
    id: "greedy",
    name: "Greedy",
    description: "Making locally optimal choices at each step with the goal of finding a global optimum.",
    prerequisites: ["Sorting", "Arrays & Hashing", "Basic Math Induction"],
    templateCode: `# Template: End-time interval sorting greedy
def max_jobs(jobs):
    jobs.sort(key=lambda x: x[1]) # sort by end time
    count = 0
    last_end = -float('inf')
    for start, end in jobs:
        if start >= last_end:
            count += 1
            last_end = end
    return count`,
    templateCodeCpp: `// Template: End-time interval sorting greedy
int max_jobs(vector<pair<int, int>>& jobs) {
    sort(jobs.begin(), jobs.end(), [](const auto& a, const auto& b) {
        return a.second < b.second; // sort by end time
    });
    int count = 0, last_end = -2e9;
    for (const auto& [start, end] : jobs) {
        if (start >= last_end) {
            count++;
            last_end = end;
        }
    }
    return count;
}`,
    problems: [
      { id: "jump-game", name: "Jump Game", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/jump-game/", topics: "Iterate from right-to-left checking if the current cell can jump to the dynamic target index, resetting the target leftward.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "jump-game-ii", name: "Jump Game II", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/jump-game-ii/", topics: "Use BFS ranges: track the farthest index reachable by any cell in the current step range, updating steps when reaching the range end.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "gas-station", name: "Gas Station", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/gas-station/", topics: "Verify that sum(gas) >= sum(cost); track rolling tank balances and reset starting index to I+1 if tank drops below zero.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "hand-of-straights", name: "Hand of Straights", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/hand-of-straights/", topics: "Count card frequencies in a min-heap or TreeMap, iteratively starting sequences of size W from the absolute lowest card.", timeComplexity: "O(N log N)", spaceComplexity: "O(N)" },
      { id: "merge-intervals", name: "Merge Intervals", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/merge-intervals/", topics: "Sort intervals by start times, and merge the incoming interval if its start time overlaps with the end time of the previous.", timeComplexity: "O(N log N)", spaceComplexity: "O(N)" },
      { id: "non-overlapping-intervals", name: "Non-overlapping Intervals", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/non-overlapping-intervals/", topics: "Sort intervals by end times, greedily selecting the first meeting that ends to leave max space for subsequent intervals.", timeComplexity: "O(N log N)", spaceComplexity: "O(1)" },
      { id: "insert-interval", name: "Insert Interval", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/insert-interval/", topics: "Insert the new interval and run linear merges on overlapping ranges before appending remaining items.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "partition-labels", name: "Partition Labels", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/partition-labels/", topics: "Record the last index of each character, and expand partition boundaries to include the last indices of all chars seen so far.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "min-arrows-burst-balloons", name: "Minimum Number of Arrows to Burst Balloons", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/min-arrows-burst-balloons/", topics: "Sort balloon intervals by end positions, shooting arrows at the end coordinates of overlapping groups.", timeComplexity: "O(N log N)", spaceComplexity: "O(1)" },
      { id: "activity-selection", name: "Activity Selection Problem", difficulty: "Easy", platform: "GFG", url: "https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/", topics: "Sort jobs by end times, and select the next job whose start time is greater than or equal to the end time of the current.", timeComplexity: "O(N log N)", spaceComplexity: "O(1)" },
      { id: "fractional-knapsack", name: "Fractional Knapsack", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/fractional-knapsack-problem/", topics: "Sort items by value-to-weight ratio, and greedily load full weights into the bag before adding a fraction of the last item.", timeComplexity: "O(N log N)", spaceComplexity: "O(1)" }
    ]
  },
  {
    id: "cyclic-sort",
    name: "Cyclic Sort",
    description: "Sorting elements mapping precisely in the range 1 to N in linear O(n) runtime.",
    prerequisites: ["Arrays (In-place Swap)", "Two Pointers"],
    templateCode: `# Template: Cyclic sort in-place placement
def cyclic_sort(arr):
    i = 0
    while i < len(arr):
        correct_idx = arr[i] - 1
        if arr[i] != arr[correct_idx]:
            arr[i], arr[correct_idx] = arr[correct_idx], arr[i] # swap
        else:
            i += 1
    return arr`,
    templateCodeCpp: `// Template: Cyclic sort in-place placement
void cyclic_sort(vector<int>& arr) {
    int i = 0;
    while (i < arr.size()) {
        int correct_idx = arr[i] - 1;
        if (arr[i] != arr[correct_idx]) {
            swap(arr[i], arr[correct_idx]);
        } else {
            i++;
        }
    }
}`,
    problems: [
      { id: "missing-number", name: "Missing Number", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/missing-number/", topics: "Sort elements cyclicly by placing each value X at index X, and find the first index I where array[i] != I.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "find-all-disappeared-numbers", name: "Find All Numbers Disappeared in an Array", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/find-all-disappeared-numbers/", topics: "Swap numbers in-place cyclicly to index val-1, then identify mismatches where array[i] != I+1.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "find-all-duplicates-array", name: "Find All Duplicates in an Array", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/find-all-duplicates-in-an-array/", topics: "Use elements as indices: negate values at index abs(val)-1, and return values whose indices point to already negative cells.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "first-missing-positive", name: "First Missing Positive", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/first-missing-positive/", topics: "Run cyclic sort ignoring non-positive values and values > N, and identify the first index I where array[i] != I+1.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "set-mismatch", name: "Set Mismatch", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/set-mismatch/", topics: "Cycle swap values to their index locations, then find the index where array[i] is duplicate and index value is missing.", timeComplexity: "O(N)", spaceComplexity: "O(1)" }
    ]
  },
  {
    id: "binary-search",
    name: "Binary Search",
    description: "Dividing search space in half repeatedly to achieve logarithmic lookups.",
    prerequisites: ["Sorted Arrays", "Two Pointers (Bounds)", "Basic Division Logic"],
    templateCode: `# Template: Sorted Binary Search index query
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
        return -1`,
    templateCodeCpp: `// Template: Sorted Binary Search index query
int binary_search(const vector<int>& arr, int target) {
    int left = 0, right = arr.size() - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
    problems: [
      { id: "binary-search-problem", name: "Binary Search", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/binary-search/", topics: "Divide target index search ranges: check midpoint values, shifting left or right bounds accordingly.", timeComplexity: "O(log N)", spaceComplexity: "O(1)" },
      { id: "search-in-rotated", name: "Search in Rotated Sorted Array", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/", topics: "Find which half of the array is sorted, check if target falls inside that sorted range, and divide the search space.", timeComplexity: "O(log N)", spaceComplexity: "O(1)" },
      { id: "find-min-rotated", name: "Find Minimum in Rotated Sorted Array", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/find-min-rotated/", topics: "Search for the inflection point: if mid element is greater than rightmost element, min is on the right; else on the left.", timeComplexity: "O(log N)", spaceComplexity: "O(1)" },
      { id: "koko-eating-bananas", name: "Koko Eating Bananas", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/koko-eating-bananas/", topics: "Run binary search on answer bounds: find the minimum speed K that allows Koko to eat all bananas within H hours.", timeComplexity: "O(N log M)", spaceComplexity: "O(1)" },
      { id: "find-first-last-position", name: "Find First and Last Position of Element in Sorted Array", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/", topics: "Run two separate binary searches: one to locate the leftmost target index and another for the rightmost target index.", timeComplexity: "O(log N)", spaceComplexity: "O(1)" },
      { id: "median-two-sorted-arrays", name: "Median of Two Sorted Arrays", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/median-two-sorted-arrays/", topics: "Binary search on partitions of the smaller array: find partition boundaries where left elements are <= right elements.", timeComplexity: "O(log(min(N,M)))", spaceComplexity: "O(1)" },
      { id: "capacity-to-ship-packages", name: "Capacity To Ship Packages Within D Days", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/", topics: "Run binary search on shipping capacity bounds, checking if the current capacity can deliver all cargo within D days.", timeComplexity: "O(N log S)", spaceComplexity: "O(1)" },
      { id: "split-array-largest-sum", name: "Split Array Largest Sum", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/split-array-largest-sum/", topics: "Use binary search on answers: search for the minimum largest subarray sum that splits the array into at most M parts.", timeComplexity: "O(N log S)", spaceComplexity: "O(1)" },
      { id: "allocate-min-pages", name: "Allocate Minimum Number of Pages", difficulty: "Hard", platform: "GFG", url: "https://www.geeksforgeeks.org/allocate-minimum-number-pages/", topics: "Run binary search on the range of page allocations, checking if a maximum page limit per student allocates books to M students.", timeComplexity: "O(N log S)", spaceComplexity: "O(1)" },
      { id: "search-2d-matrix", name: "Search in a 2D Matrix", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/search-a-2d-matrix/", topics: "Flatten the 2D matrix conceptually into a 1D array using coordinates mapping (row = index / cols, col = index % cols) and run standard binary search.", timeComplexity: "O(log(R*C))", spaceComplexity: "O(1)" },
      { id: "aggressive-cows", name: "Aggressive Cows", difficulty: "Hard", platform: "Codeforces", url: "https://www.spoj.com/problems/AGGRCOW/", topics: "Run binary search on distances: check if cows can be placed in stalls with a minimum distance difference D between them.", timeComplexity: "O(N log S)", spaceComplexity: "O(1)" }
    ]
  },
  {
    id: "stack-queues",
    name: "Stack & Queues",
    description: "Last-In-First-Out (LIFO) and First-In-First-Out (FIFO) behaviors for sequencing.",
    prerequisites: ["Arrays & Hashing", "LIFO / FIFO Concepts"],
    templateCode: `# Template: Standard stack LIFO push/pop evaluation
def evaluate(expression):
    stack = []
    for char in expression:
        if is_operand(char):
            stack.append(int(char))
        else:
            op2 = stack.pop()
            op1 = stack.pop()
            stack.append(apply_operator(char, op1, op2))
    return stack[0]`,
    templateCodeCpp: `// Template: Standard stack LIFO push/pop evaluation
int evaluate(const string& tokens) {
    stack<int> s;
    for (char c : tokens) {
        if (isdigit(c)) s.push(c - '0');
        else {
            int op2 = s.top(); s.pop();
            int op1 = s.top(); s.pop();
            s.push(apply_operator(c, op1, op2));
        }
    }
    return s.top();
}`,
    problems: [
      { id: "valid-parentheses", name: "Valid Parentheses", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/valid-parentheses/", topics: "Push open brackets to a stack, and pop to verify matching brackets when encountering closing brackets.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "min-stack", name: "Min Stack", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/min-stack/", topics: "Maintain a secondary stack that stores min values, keeping the minimum element aligned with the primary stack insertions.", timeComplexity: "O(1)", spaceComplexity: "O(N)" },
      { id: "evaluate-reverse-polish", name: "Evaluate Reverse Polish Notation", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/", topics: "Push operands to a stack, popping the top two values to apply operators as they appear.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "generate-parentheses", name: "Generate Parentheses", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/generate-parentheses/", topics: "Generate balanced brackets using backtracking recursion, keeping open counts < target and closing counts < open counts.", timeComplexity: "O(4^N / sqrt(N))", spaceComplexity: "O(N)" },
      { id: "daily-temperatures", name: "Daily Temperatures", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/daily-temperatures/", topics: "Maintain indices in a monotonic decreasing stack, popping to calculate index offsets when finding a warmer day.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "next-greater-element-i", name: "Next Greater Element I", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/next-greater-element-i/", topics: "Use a monotonic stack to resolve next greater elements, storing mappings inside a hash map for fast query lookups.", timeComplexity: "O(N + M)", spaceComplexity: "O(N)" },
      { id: "largest-rectangle-histogram", name: "Largest Rectangle in Histogram", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/", topics: "Use a monotonic increasing stack to track boundaries, calculating rectangle heights when popping smaller heights.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "car-fleet", name: "Car Fleet", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/car-fleet/", topics: "Sort cars by start positions, calculate arrival times, and check time overlaps using a stack to identify fleets.", timeComplexity: "O(N log N)", spaceComplexity: "O(N)" },
      { id: "implement-queue-stacks", name: "Implement Queue using Stacks", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/implement-queue-using-stacks/", topics: "Simulate a FIFO queue using two LIFO stacks: push elements to input stack, and shift to output stack only when popping.", timeComplexity: "O(1) amortized", spaceComplexity: "O(N)" },
      { id: "sliding-window-max-deque", name: "Sliding Window Maximum (Deque)", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/sliding-window-maximum/", topics: "Maintain a monotonic deque of indices in decreasing element values, popping indices that fall outside the current sliding window range.", timeComplexity: "O(N)", spaceComplexity: "O(K)" },
      { id: "stock-span-problem", name: "Stock Span Problem", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/the-stock-span-problem/", topics: "Pop indices from a monotonic decreasing stack when the incoming stock price is larger, calculating index offsets.", timeComplexity: "O(N)", spaceComplexity: "O(N)" }
    ]
  },
  {
    id: "linked-lists",
    name: "Linked Lists",
    description: "Singly, doubly, and circular node manipulation including reversal and cycle checks.",
    prerequisites: ["Pointers / Object References", "Custom Class Definitions", "Basic Loops"],
    templateCode: `# Template: Linked List Pointer Reversal
def reverse_list(head):
    prev = None
    curr = head
    while curr:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    return prev`,
    templateCodeCpp: `// Template: Linked List Pointer Reversal
ListNode* reverse_list(ListNode* head) {
    ListNode* prev = nullptr;
    ListNode* curr = head;
    while (curr) {
        ListNode* next_node = curr->next;
        curr->next = prev;
        prev = curr;
        curr = next_node;
    }
    return prev;
}`,
    problems: [
      { id: "reverse-linked-list", name: "Reverse Linked List", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/reverse-linked-list/", topics: "Iterate through the nodes, swapping pointer direction by setting curr.next to prev at each step.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "merge-two-sorted-lists", name: "Merge Two Sorted Lists", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/merge-two-sorted-lists/", topics: "Use a dummy head node and a pointer, iteratively linking the node with the smaller value to build the merged list.", timeComplexity: "O(N + M)", spaceComplexity: "O(1)" },
      { id: "linked-list-cycle", name: "Linked List Cycle", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/linked-list-cycle/", topics: "Master Floyd's Tortoise and Hare algorithm: move a slow pointer by 1 and a fast pointer by 2 to detect intersections.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "reorder-list", name: "Reorder List", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/reorder-list/", topics: "Identify the list middle using slow/fast pointers, reverse the second half, and merge the two halves in alternating order.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "remove-nth-from-end", name: "Remove Nth Node From End of List", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/", topics: "Advance a fast pointer by N steps, then move slow and fast pointers together until fast reaches the end to find the target deletion node.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "copy-list-random-pointer", name: "Copy List with Random Pointer", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/copy-list-with-random-pointer/", topics: "Clone list nodes and interleave them directly next to original nodes (e.g. A -> A' -> B -> B') to copy random pointers in-place.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "add-two-numbers", name: "Add Two Numbers", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/add-two-numbers/", topics: "Traverse list nodes simultaneously, summing values along with a carry variable and building the result list node-by-node.", timeComplexity: "O(max(N,M))", spaceComplexity: "O(max(N,M))" },
      { id: "find-duplicate-number", name: "Find the Duplicate Number", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/find-the-duplicate-number/", topics: "Map the array values as list node pointers, and use Floyd's cycle detection to locate the cycle entrance.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "lru-cache", name: "LRU Cache", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/lru-cache/", topics: "Combine a Doubly Linked List (for O(1) node deletion and head insertions) with a Hash Map (for O(1) key lookups).", timeComplexity: "O(1)", spaceComplexity: "O(C)" },
      { id: "merge-k-sorted-lists", name: "Merge K Sorted Lists", difficulty: "Hard", platform: "LeetCode", url: "https://leetcode.com/problems/merge-k-sorted-lists/", topics: "Divide and conquer list merges recursively, or push head nodes into a Min-heap to iteratively merge elements.", timeComplexity: "O(N log K)", spaceComplexity: "O(K)" },
      { id: "detect-remove-loop", name: "Detect and Remove Loop", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/detect-and-remove-loop-in-a-linked-list/", topics: "Run Floyd's cycle detection, find the cycle entrance by resetting one pointer to head, and break the loop by clearing the tail node next pointer.", timeComplexity: "O(N)", spaceComplexity: "O(1)" }
    ]
  },
  {
    id: "arrays-hashing",
    name: "Arrays & Hashing",
    description: "Frequency counters, prefix sums, hash maps, and linear scans.",
    prerequisites: ["Loops & Conditionals", "Variable Manipulation", "Basic Key-Value Concepts"],
    templateCode: `# Template: Target offset check using hash map
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []`,
    templateCodeCpp: `// Template: Target offset check using hash map
vector<int> two_sum(const vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int diff = target - nums[i];
        if (seen.count(diff)) return {seen[diff], i};
        seen[nums[i]] = i;
    }
    return {};
}`,
    problems: [
      { id: "two-sum", name: "Two Sum", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/two-sum/", topics: "Store visited numbers in a hash map mapping value-to-index to check if (target - current) exists in O(1) time.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "contains-duplicate", name: "Contains Duplicate", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/contains-duplicate/", topics: "Iterate through elements, loading them into a hash set to identify duplicate occurrences.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "valid-anagram", name: "Valid Anagram", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/valid-anagram/", topics: "Count character frequencies using a hash map or fixed-size array, verifying that both strings have matching counts.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "group-anagrams", name: "Group Anagrams", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/group-anagrams/", topics: "Group strings by hashing their sorted values or character count lists inside a hash map.", timeComplexity: "O(N * K log K)", spaceComplexity: "O(N * K)" },
      { id: "top-k-frequent", name: "Top K Frequent Elements", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/top-k-frequent-elements/", topics: "Count element frequencies, and group values into buckets indexed by count (Bucket Sort) to find top elements in O(N).", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "product-except-self", name: "Product of Array Except Self", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/product-of-array-except-self/", topics: "Calculate rolling products: build prefix products on a forward pass, and multiply by suffix products on a backward pass.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "valid-sudoku", name: "Valid Sudoku", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/valid-sudoku/", topics: "Verify constraints by inserting grid entries into hash sets tracking rows, columns, and 3x3 sub-grids.", timeComplexity: "O(1)", spaceComplexity: "O(1)" },
      { id: "longest-consecutive", name: "Longest Consecutive Sequence", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/longest-consecutive-sequence/", topics: "Load values into a hash set; if X-1 does not exist in set, count consecutive numbers X+1, X+2... to find the longest chain.", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "subarray-sum-equals-k", name: "Subarray Sum Equals K", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/subarray-sum-equals-k/", topics: "Maintain a running prefix sum, checking a hash map of prefix sum frequencies for instances of (prefix_sum - K).", timeComplexity: "O(N)", spaceComplexity: "O(N)" },
      { id: "majority-element", name: "Majority Element", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/majority-element/", topics: "Master Boyer-Moore Voting Algorithm: maintain a candidate and count, incrementing on matches and decrementing on mismatches.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "find-all-duplicates", name: "Find All Duplicates in an Array", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/find-duplicates-in-on-time-and-constant-extra-space/", topics: "Identify duplicate values by marking indices negative, checking if cell is already negative to find duplicates.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "rearrange-array-alternately", name: "Rearrange Array Alternately", difficulty: "Medium", platform: "GFG", url: "https://www.geeksforgeeks.org/rearrange-array-alternately/", topics: "Use index mathematical encoding (A[i] += A[max_idx] % max_val * max_val) to store two elements at a single array cell.", timeComplexity: "O(N)", spaceComplexity: "O(1)" }
    ]
  },
  {
    id: "bit-manipulation",
    name: "Bit Manipulation",
    description: "Using binary XOR, AND, OR operators to solve problems at the register level.",
    prerequisites: ["Binary Number Representation", "Bitwise Operators (AND, OR, XOR, Shifts)"],
    templateCode: `# Template: Bitwise XOR duplicates cancellation
def single_number(nums):
    res = 0
    for num in nums:
        res ^= num # XOR cancels duplicate values
    return res`,
    templateCodeCpp: `// Template: Bitwise XOR duplicates cancellation
int single_number(const vector<int>& nums) {
    int res = 0;
    for (int num : nums) {
        res ^= num;
    }
    return res;
}`,
    problems: [
      { id: "single-number", name: "Single Number", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/single-number/", topics: "XOR all array elements: identical numbers cancel each other out, leaving only the unique single number.", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "number-of-1-bits", name: "Number of 1 Bits", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/number-of-1-bits/", topics: "Count set bits using Brian Kernighan's algorithm: repeatedly subtract 1 and bitwise AND with the original (n & (n - 1)).", timeComplexity: "O(1)", spaceComplexity: "O(1)" },
      { id: "counting-bits", name: "Counting Bits", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/counting-bits/", topics: "Build a bitwise DP table: set bits in X is (bits in X / 2) + (X % 2).", timeComplexity: "O(N)", spaceComplexity: "O(1)" },
      { id: "reverse-bits", name: "Reverse Bits", difficulty: "Easy", platform: "LeetCode", url: "https://leetcode.com/problems/reverse-bits/", topics: "Iterate 32 times, shifting the result left and OR-ing with the last bit of the input number.", timeComplexity: "O(1)", spaceComplexity: "O(1)" },
      { id: "sum-of-two-integers", name: "Sum of Two Integers", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/sum-of-two-integers/", topics: "Perform summation using bitwise operations: XOR calculates the sum without carries, and AND shifts carries left.", timeComplexity: "O(1)", spaceComplexity: "O(1)" },
      { id: "bitwise-and-range", name: "Bitwise AND of Numbers Range", difficulty: "Medium", platform: "LeetCode", url: "https://leetcode.com/problems/bitwise-and-of-numbers-range/", topics: "Shift both range endpoints right until they match to find the common bit prefix, then shift the prefix back.", timeComplexity: "O(1)", spaceComplexity: "O(1)" }
    ]
  }
];
