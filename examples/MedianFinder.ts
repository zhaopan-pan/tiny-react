interface Comparable<T> {
    compareTo(that: T): number
    equals(that: T): boolean
}

/**
 *优先级队列
 *
 * @class PriorityQueue
 * @template E
 */
class PriorityQueue<E extends number | string | Comparable<E>> {
    pq: E[] = []
    private _size = 0

    constructor(comparator?: (a: E, b: E) => boolean) {
        if (comparator) {
            // 如果入参是函数就直接定义比较函数
            this.less = (i: number, j: number) => {
                return comparator(this.pq[i], this.pq[j])
            }
        }
    }

    size() {
        return this._size
    }

    isEmpty() {
        return this._size === 0
    }

    /**
     * 插入
     * @param e 
     */
    insert(e: E) {
        // size自增，在堆尾部插入元素
        this.pq[++this._size] = e
        // 执行上浮操作
        this.swim(this._size)
    }


    /**
     * 删除
     * @returns 
     */
    remove() {
        // 取出根节点的值
        const min = this.pq[1]

        // 根节点和尾节点交换位置
        this.exch(1, this._size)
        this._size--
        // 通过改变长度删除尾节点值
        // this.pq.length = this._size + 1
        // pop删除更优雅一些
        this.pq.pop()

        // 为了方便删除把首尾调换了位置，这时根节点就是之前的尾节点
        // 所以要通过比较规则执行下沉操作
        this.sink(1)

        return min
    }

    /**
     * 根据索引交换位置
     * @param i
     * @param j
     */
    private exch(i: number, j: number) {
        const t = this.pq[i]
        this.pq[i] = this.pq[j]
        this.pq[j] = t
    }

    /**
     * 下沉操作:如果有子节点就循环遍历整棵树，
     * 小顶堆情况下：和最小子节点比较，大顶堆：和最大子节点比较
     * 根据规则判断是和左子节点还是右子节点交换位置
     * 
     * @param k 
     */
    private sink(k: number) {
        // 如果左子节点索引值(2 * k)小于数组长度，就一直循环
        while (2 * k <= this._size) {
            // 暂存左子节点索引
            let j = 2 * k
            // 这个判断是为了筛选出是【左】还是【右】需要和下沉节点交换位置，根据比较规则(less())比较两个节点
            // j+1是右子节点索引， 如果小于等于总长度说明右子节点是存在的
            // 当然了如果不存在右子节点，说明只有一个子节点，那就好办了，直接和下沉节点比较就好了
            // 这时就比较两个子节点，
            // 小顶堆情况下：如果左子节点较大，说明需替换的位置是右子节点，这时要保存右子节点的索引值，j++，j就变成右子节点的索引
            // 大顶堆情况下和上面思路大体一样，只是把比较规则相反了，因为要用子节点中较大值和下沉节点交换
            if (j + 1 <= this._size && this.less(j + 1, j)) j++

            // 比较下称节点和子节点，不符合规则就终止并跳出循环
            if (this.less(k, j)) break

            // 符合比较规则 就交换位置(j就是那个最大或最小节点的索引)
            this.exch(k, j)
            // 更新索引，为下一轮循环准备
            k = j
        }
    }

    /**
     * 上浮操作:从底部往上 用k索引的节点值和父节点值比较，循环执行
     * @param k 最后一个节点的索引
     */
    private swim(k: number) {
        let j: number
        // Math.floor(k / 2) 为 k的父节点索引值
        // 如果k大于1 且 父节点大于子节点
        while (k > 1 && this.less(k, (j = Math.floor(k / 2)))) {
            // 就调换父子节点位置
            this.exch(j, k)
            // 换位置后，需要更新操作元素的索引
            k = j
        }
    }

    /**
     * 根据索引比较元素
     * 
     * @param i 节点索引
     * @param j 节点索引
     * @returns 
     */
    private less(i: number, j: number): boolean {
        if (typeof this.pq[i] === 'string' || typeof this.pq[i] === 'number') {
            return this.pq[i] < this.pq[j]
        } else {
            return (this.pq[i] as Comparable<E>).compareTo(this.pq[j]) < 0
        }
    }

    // 返回根节点值(数组内的第二个值，因为是从下标1开始的)
    peek(): null | E {
        return this.pq[1] ?? null
    }
}

/**
 * 查找中间值类
 * 
 * @class MedianFinder
 */
class MedianFinder {
    // 小顶堆，存放大于中位数的值 堆顶是小的 [空白, 4, 5, 6, 8]
    private minPQ: PriorityQueue<number> = new PriorityQueue<number>()

    /**
     * 大顶堆，存放小于中位数的值 堆顶是大的 [空白, 3, 1, 2]
     * 
     * 这里在创建实例的时候给构造函数传了一个比较函数，
     * 是因为PriorityQueue类中的比较方法是单一的i<j,不满足大顶堆情况下的比较规则
     * 传入的这个比较函数会在类的构造函数中覆盖默认的比较函数
     */
    private maxPQ: PriorityQueue<number> = new PriorityQueue<number>((a, b) => {
        return a > b
    })

    size(): number {
        return this.minPQ.size() + this.maxPQ.size()
    }

    /**
     * 向队列添加值
     * 根据队列的length分两种情况：
     *  偶数:优先插入小顶堆
     *  奇数:优先插入大顶堆
     * @param v 
     */
    addNum(v: number): void {
        // 如果队列长度偶数或首次添加值
        if (this.size() % 2 === 0) {

            // 获取大顶堆的根节点值
            const max = this.maxPQ.peek()

            // max为null(说明是第一次添加)或者 当前添加值大于 大顶堆中的最大值
            if (max === null || max < v) {
                // 就给小顶堆添加
                this.minPQ.insert(v)
            } else {
                // 大顶堆根节点 >= 添加值：说明此添加值属于大顶堆，而且需要把此时大顶堆的根节点移动到小顶堆
                // 如果大顶堆根节点 === 添加值，这时这两个相同的值会各存在于大小顶堆中
                this.minPQ.insert(this.maxPQ.remove())
                this.maxPQ.insert(v)
            }
        } else {
            // 奇数情况下
            // 取出小顶堆的根节点值
            const min = this.minPQ.peek()

            // 小顶堆为空 或者 小顶堆最小值 > 当前值，
            if (min === null || v < min) {
                // 说明属于大顶堆
                this.maxPQ.insert(v)
            } else {
                // 这里也会有两种情况：
                // 小顶堆根节点 =< 添加值：说明此小顶堆根节点的值还不够小，此时需要小顶堆的根节点移动到大顶堆，然后把更小的当前值插入到小顶堆
                // 如果小顶堆根节点 === 添加值，这时这两个相同的值会各存在于大小顶堆中
                this.maxPQ.insert(this.minPQ.remove())
                this.minPQ.insert(v)
            }
        }
    }

    /**
     * 查找中间值
     * @returns 中间值
     */
    findMedian(): number | null {
        const size = this.size()

        if (size === 0) return null

        console.log("大顶堆:\n", this.maxPQ.pq)
        console.log("小顶堆:\n", this.minPQ.pq)
        // 偶数
        if (size % 2 === 0) {
            // 返回两个堆根节点的平均值
            return (this.minPQ.peek()! + this.maxPQ.peek()!) / 2
        } else {
            // 小顶堆的根节点值
            return this.minPQ.peek()
        }
    }
}


export default function finder() {
    /**
     * 使用两个优先级堆（priority heap），即一个大顶堆，存放小于中位数的值，以
     * 及一个小顶堆，存放大于中位数的值。这会将所有元素大致分为两半，中间的两个元素位于两个堆的堆顶。这样一来，要找出中间值就是小事一桩。
     */
    const mf = new MedianFinder()
    // const heap = Array.from({length: 10}, (v, i) => i + 1)
    const heap = [1, 2, 3, 4, 5, 6,]
    console.log(heap)
    heap.map((item, i) => mf.addNum(item))
    console.log(`${heap}的中位数是：`, mf.findMedian())
}
