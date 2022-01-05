
const minHeapSort = (arr: any[]) => {
    // 1. 构造最小堆
    buildMinHeap(arr)
    console.log("aaa", arr)
    // 2. 循环提取根节点arr[0], 直到全部提取完
    for (let i = arr.length - 1; i > 0; i--) {
        let tmp = arr[0]
        arr[0] = arr[i]
        arr[i] = tmp
        siftDown(arr, 0, i - 1)
    }
}

// 把整个数组构造成最小堆
const buildMinHeap = (arr: any[]) => {
    if (arr.length < 2) {
        return arr
    }
    // 第一个非叶子结点的下标
    const startIndex = Math.floor(arr.length / 2 - 1)
    for (let i = startIndex; i >= 0; i--) {
        siftDown(arr, i, arr.length - 1)
    }
}

// 从startIndex索引开始, 向下调整最小堆
const siftDown = (arr: any[], startIndex: number, endIndex: number) => {
    const leftChildIndx = 2 * startIndex + 1
    const rightChildIndx = 2 * startIndex + 2
    let swapIndex = startIndex
    let tmpNode = arr[startIndex]
    if (leftChildIndx <= endIndex) {
        if (arr[leftChildIndx] < tmpNode) {
            // 待定是否交换, 因为right子节点有可能更小
            tmpNode = arr[leftChildIndx]
            swapIndex = leftChildIndx
        }
    }
    if (rightChildIndx <= endIndex) {
        if (arr[rightChildIndx] < tmpNode) {
            // 比left节点更小, 替换swapIndex
            tmpNode = arr[rightChildIndx]
            swapIndex = rightChildIndx
        }
    }
    if (swapIndex !== startIndex) {
        // 1.交换节点
        arr[swapIndex] = arr[startIndex]
        arr[startIndex] = tmpNode

        // 2. 递归调用, 继续向下调整
        siftDown(arr, swapIndex, endIndex)
    }
}



export default function minHeapSortFn() {
    var arr1 = [5, 8, 0, 10, 4, 6, 1]
    minHeapSort(arr1)
    console.log("minHeapSort:", arr1) // [10, 8, 6, 5,4, 1, 0]
    // var arr2 = [5]
    // minHeapSort(arr2)
    // console.log(arr2) // [ 5 ]

    // var arr3 = [5, 1]
    // minHeapSort(arr3)
    // console.log(arr3) //[ 5, 1 ]
}