//选择排序
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
//冒泡
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

//堆排序
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
//快速排序（分治）
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
