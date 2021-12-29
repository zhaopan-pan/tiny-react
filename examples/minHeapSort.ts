import {start} from 'repl'

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

// 交换两个节点
function swap(A: number[], i: number, j: number) {
    let temp = A[i]
    A[i] = A[j]
    A[j] = temp
}
/**
 * 移动操作
 * @param arr 
 * @param startIndex 
 * @param endIndex 
 * @returns 
 */
function shiftDown(arr: number[], startIndex: number, endIndex: number) {
    // 当前父节点值
    const temp = arr[startIndex]
    // i = 2 * startIndex + 1 左子节点，
    // i < endIndex 目的是对结点 startIndex 以下的结点全部做顺序调整
    // i = 2 * i + 1 左子节点的左子节点，靠它循环
    for (let i = 2 * startIndex + 1; i < endIndex; i = 2 * i + 1) {
        // 如果右子节存在，且右子节点大于左子节点，就把i更新成右子节点的下标
        if (i + 1 < endIndex && arr[i] < arr[i + 1]) {
            i++
        }
        // 如果父节点小于子节点:交换；否则跳出
        if (temp < arr[i]) {
            swap(arr, startIndex, i)
            startIndex = i
        } else {
            return
        }
    }

}
function createMaxHeapSort(arr: number[]) {
    // 创建大顶堆
    // 最后一个非叶子节点下标
    const startIndex = Math.floor(arr.length / 2 - 1)
    for (let i = startIndex; i >= 0; i--) {
        //从第一个非叶子结点从下至上，从右至左调整结构
        shiftDown(arr, i, arr.length)
    }
    // 推排序，倒序循环执行
    // arr.length - 1： 最后一个节点交换位置后是最大或最小的，排除最后一个节点
    for (let j = arr.length - 1; j > 0; j--) {
        // 根节点合和最后一个交换位置
        swap(arr, 0, j)
        // 从根节点开始对堆进行调整
        shiftDown(arr, 0, j)
    }
}
//堆排序的基本思想是：将待排序序列构造成一个大顶堆，此时，整个序列的最大值就是堆顶的根节点。
//将其与末尾元素进行交换，此时末尾就为最大值。然后将剩余n - 1个元素重新构造成一个堆，
//这样会得到n个元素的次小值。如此反复执行，便能得到一个有序序列了

// 将初始二叉树转化为大顶堆（heapify）（实质是从第一个非叶子结点开始，从下至上，从右至左，对每一个非叶子结点做shiftDown操作），此时根结点为最大值，将其与最后一个结点交换。
// 除开最后一个结点，将其余节点组成的新堆转化为大顶堆（实质上是对根节点做shiftDown操作），此时根结点为次最大值，将其与最后一个结点交换。
// 重复步骤2，直到堆中元素个数为1（或其对应数组的长度为1），排序完成。
export default function minHeapSortFn() {
    var arr1 = [5, 8, 0, 10, 4, 6, 1]
    createMaxHeapSort(arr1)
    console.log("升序：", arr1)
    // minHeapSort(arr1)
    // console.log(arr1) // [10, 8, 6, 5,4, 1, 0]
    // var arr2 = [5]
    // minHeapSort(arr2)
    // console.log(arr2) // [ 5 ]

    // var arr3 = [5, 1]
    // minHeapSort(arr3)
    // console.log(arr3) //[ 5, 1 ]
}