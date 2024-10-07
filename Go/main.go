package main

import "fmt"

var GRID_SIZE = 20

//	func main() {
//		fmt.Println("Hello World")
//	}
func dfsHelper(x int, y int, endx int, endy int, visited map[string]bool, path *[][]int) bool {
	val, exists := visited[fmt.Sprintf("%d,%d", x, y)]
	if x < 0 || y < 0 || x >= GRID_SIZE || y >= GRID_SIZE || exists {
		return false
	}
	visited[fmt.Sprintf("%d,%d", x, y)] = val
	*path = append(*path, []int{x, y})
	if x == endx && y == endy {
		return true
	}
	directions := [][]int{
		{1, 0}, {-1, 0}, {0, 1}, {0, -1}, {1, 1}, {1, -1}, {-1, 1}, {-1, -1},
	}
	for _, dir := range directions {
		if dfsHelper(x+dir[0], y+dir[1], endx, endy, visited, path) {
			return true
		}
	}

	*path = (*path)[:len(*path)-1]
	return false
}
func dfs(grid [][]int, startrow int, startcol int, endrow int, endcol int) [][]int {
	// path := make([][]int, 0)
	// point := []int{1, 2}

	// path = append(path, point)
	// visited := make(map[string][]int)
	path := [][]int{}
	visited := make(map[string]bool)
	if dfsHelper(startrow, startcol, endrow, endcol, visited, &path) {
		return path
	}

	return nil
}
func main() {
	grid := make([][]int, GRID_SIZE)
	for i := range grid {
		grid[i] = make([]int, GRID_SIZE)
	}
	startrow, startcol := 10, 0
	endrow, endcol := 19, 19
	path := dfs(grid, startrow, startcol, endrow, endcol)
	if path != nil {
		for _, point := range path {
			fmt.Println("row:", point[0], point[1])
		}
	} else {
		fmt.Println("No Path found")
	}
}
