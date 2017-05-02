//1. 选择排序
function simpleSelectionSort(a) { //选择排序
    var tem;
    for(var i=0; i<a.length-1; i++) {
        for(var j=i+1; j<a.length; j++)
            if(a[j]<a[i]) {
                tem = a[i];
                a[i] = a[j];
                a[j] = tem;
            }
    }
    return a;
}

//2. 冒泡
function bubbleSort(a) {
    var n = a.length;
    for(var i=0; i<n-1; i++) {
        for(var j=0; j<n-i-1; j++) {
            if(a[j+1]<a[j]) {
                a[j] = [a[j+1],a[j+1]=a[j]][0]
                //[a[j],a[i]] = [a[i],a[j]] #ie不支持
            }
        }
    }
    return a;
}

//3. 堆排序
function getLog(a, r) {
    var i = 0;
    while(true) {
        if(Math.pow(a,i)==r)
            return i;
        else if(Math.pow(a,i)<r && Math.pow(a,i+1)>r)
            return i+1;
        else 
            i++;
    }
}

function tarHeapSort(a) {
    var n = a.length;
    var left, right;
    var depth = getLog(2, n);
    var j = depth;
    while(--j>=0) {
        for(var i=0; i<n; i++) {
            left = i*2+1, right = i*2+2;
            if(right<n && a[left]>a[right]) {
                [a[left], a[right]] = [a[right], a[left]];
            }
            if(left<n && a[left]<a[i]) {
                [a[left], a[i]] = [a[i], a[left]]
            }
            if(right<n && a[left]>a[right]) {
                [a[left], a[right]] = [a[right], a[left]];
            }
        }
    }
    return a;
}

function heapSort(a) {
    var n = a.length;
    var a2=[];
    var j = n;
    while(--j>=0) {
        a = tarHeapSort(a)
        a2.push(a[0])
        a.shift();
    } 
    return a2; 
}

//4. 快速排序（分治）
function quickSort(a) {
    var n = a.length;
    var soilder = a[n-1];
    var left=[], right=[soilder];
    var allIsEqual = 1;
    for(var i=0; i<n-1; i++) {
        if(a[i]<soilder) {
            left.push(a[i])
        } else {//right数组不可能为空，如果和soilder相等，都是放在right里
            right.push(a[i]);
            if(a[i]==soilder) {
                allIsEqual++;
            }
        }
        
    }
    if(allIsEqual==n) { //如果这个数组里面的额数字全部相等，就不用再比了
        return a;
    } else {
        if(left.length>1)
            left = quickSort(left);
        if(right.length>1)
            right = quickSort(right);
        return left.concat(right);
    }
}

//5. 基数排序（桶排序）
function radixSort(a) {
    var n = a.length;
    var bucketCount = 10;
    var bucket = [], radix;
    var remainder = 1, maxDigit = 1;

    while(true) {
        bucket = [];
        for(var i=0; i<n; i++) {
            if(remainder==1 && getNoLength(a[i])>maxDigit) {
                maxDigit = getNoLength(a[i]);
            }
            radix = getNoDigit(a[i],remainder-1);
            if(typeof bucket[radix] == "object") {
                bucket[radix].push(a[i]);
            } else {
                bucket[radix] = [a[i]];
            }
        }
        a = []
        for(var i=0; i<10; i++) {
            if(typeof bucket[i] == "object") {
                a = a.concat(bucket[i])
            }

        }
        if(remainder==maxDigit) {
            break;
        } else {          
            remainder++;
        }
    }
    return a;
}
function getNoLength(n) {//获得数字的长度
    var s = n + "";
    return s.length;
}
function getNoDigit(n,i) {//获得数字n的倒数第i位，i从0开始
    var s = (n + "");
    s = s.split("").reverse();
    if(i>s.length-1) {
        return 0;
    } else {
        return s[i];
    }
}

//6. 归并排序
function mergeSort(a) {
    var n = a.length;
    if(n<=1) {
        return a;
    } else if(n==2) {
        if(a[0]>a[1]) {
            [a[0], a[1]] = [a[1], a[0]]
        }
        return a;
    } else {
        var mid = Math.floor(n/2);
        var left = a.slice(0,mid), right = a.slice(mid);
        left = mergeSort(left);
        right = mergeSort(right);
        a = mergeArray(left, right);
        return a;
    }
}
function mergeArray(left, right) {//合并两个有序数组
    var a = [];
    var nl = left.length, nr = right.length;
    var i = 0, j = 0;
    while(i<nl&&j<nr) {
        if(left[i]<right[j]) {
            a.push(left[i++]);
        } else {
            a.push(right[j++]);
        }
    }
    a = a.concat(left.slice(i,nl));
    a = a.concat(right.slice(j,nr));
    return a;
}

//7. 直接插入排序
function insertSort(a) {
    if(a.length<1) {
        return a;
    }
    var tem = [a[0]];
    for(var i=1; i<a.length; i++) {
        tem = insertToSortedArray(a[i], tem);
    }
    return tem;
}
function insertToSortedArray(n, a) {//把n插入有序数组a中
    var i;
    for(i=0; i<a.length; i++) {
        if(a[i]>n) {//插入a[i]前
            break;
        }
    }
    for(var j=a.length; j>i; j--) {
        a[j] = a[j-1];
    }
    a[i] = n;
    return a;
}

//8. shell排序
function shellSort(a) {
    var gap = parseInt(a.length/2);
    while(gap>=1) {
        a = shellInsertSort(a, gap)
        gap = parseInt(gap/2);
    }
    return a;
}
function shellInsertSort(a, gap) {
    var j, tem;
    for(var i=gap; i<a.length; i++) {
        if(a[i]<a[i-gap]) {
            j = i-gap;
            tem = a[i];
            a[i] = a[j];
            while(tem<a[j]) {
                a[j+gap] = a[j];
                j -= gap;
            }
            a[j+gap] = tem;
        }
    }
    return a;
}
