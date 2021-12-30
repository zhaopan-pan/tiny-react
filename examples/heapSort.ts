

// 交换两个节点
function swap(A: number[], i: number, j: number) {
    let temp = A[i]
    A[i] = A[j]
    A[j] = temp
}


/**
 * 移动操作
 * @param arr 
 * @param startIndex 开始下标
 * @param endIndex 结束下标
 * @returns 
 */
function shiftDown(arr: number[], startIndex: number, endIndex: number, compareTo: (l: number, r: number) => Boolean) {
    // 当前父节点值
    const temp = arr[startIndex]
    // i = 2 * startIndex + 1 左子节点，
    // i < endIndex 目的是对结点 startIndex 以下的结点全部做顺序调整
    // i = 2 * i + 1 左子节点的左子节点，靠它循环
    for (let i = 2 * startIndex + 1; i < endIndex; i = 2 * i + 1) {
        // 如果右子节存在，且右子节点大于左子节点，就把i更新成右子节点的下标
        if (i + 1 < endIndex && compareTo(arr[i], arr[i + 1])) {
            i++
        }
        // 根据比较规则看是否需要父子替换，否则跳出
        if (compareTo(temp, arr[i])) {
            swap(arr, startIndex, i)
            // 更新父节点索引
            startIndex = i
        } else {
            break
        }
    }

}

/**
 * 堆排序方法
 * @param a 需要排序的数据
 * @param compare 比较方法，决定升降循序
 */
function heapSortFn(a: number[], compare?: (l: number, r: number) => Boolean) {
    // 默认降序，可以自定义成升序
    const compareTo = compare ? compare : (l: number, r: number) => l > r
    const arr = a
    // 创建大顶堆 (一般升序采用大顶堆，降序采用小顶堆)
    // 最后一个非叶子节点下标
    const startIndex = Math.floor(arr.length / 2 - 1)
    for (let i = startIndex; i >= 0; i--) {
        //从第一个非叶子结点从下至上，从右至左调整结构
        shiftDown(arr, i, arr.length, compareTo)
    }
    // 推排序，倒序循环执行
    // arr.length - 1： 最后一个节点交换位置后是最大或最小的，排除最后一个节点
    for (let j = arr.length - 1; j > 0; j--) {
        // 根节点合和最后一个交换位置
        swap(arr, 0, j)
        // 从根节点开始对堆进行调整
        shiftDown(arr, 0, j, compareTo)
    }
}

// 此处以升序为例：
// 将初始二叉树转化为大顶堆（heapify）:实质是从第一个非叶子结点开始，从下至上，从右至左，对每一个非叶子结点做shiftDown操作
// 【重点】:此时根结点为最大值，将其与最后一个结点交换
// 除开最后一个结点，将其余节点组成的新堆转化为大顶堆，此时根结点为次最大值，将其与最后一个结点交换。
// 重复步骤2，直到堆中元素个数为1（或其对应数组的长度为1），排序完成。
export default function heapSort() {
    var arr1 = [5, 8, 0, 10, 4, 6, 1]
    heapSortFn(arr1)
    console.log("降序:", arr1)
    // heapSortFn(arr1, (i: number, j: number) => i < j)
    // console.log("升序:", arr1)
}