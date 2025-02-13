简介
每种编程语言都有它的内存管理机制，比如简单的C有低级的内存管理基元，像malloc(),free()。同样我们在学习JavaScript的时候，很有必要了解JavaScript的内存管理机制。 JavaScript的内存管理机制是:内存基元在变量（对象，字符串等等）创建时分配，然后在他们不再被使用时“自动”释放。后者被称为垃圾回收。这个“自动”是混淆并给JavaScript（和其他高级语言）开发者一个错觉：他们可以不用考虑内存管理。 对于前端开发来说，内存空间并不是一个经常被提及的概念，很容易被大家忽视。当然也包括我自己。在很长一段时间里认为内存空间的概念在JS的学习中并不是那么重要。可是后我当我回过头来重新整理JS基础时，发现由于对它们的模糊认知，导致了很多东西我都理解得并不明白。比如最基本的引用数据类型和引用传递到底是怎么回事儿？比如浅复制与深复制有什么不同？还有闭包，原型等等。 但其实在使用JavaScript进行开发的过程中，了解JavaScript内存机制有助于开发人员能够清晰的认识到自己写的代码在执行的过程中发生过什么，也能够提高项目的代码质量。

内存模型
JS内存空间分为栈(stack)、堆(heap)、池(一般也会归类为栈中)。 其中栈存放变量，堆存放复杂对象，池存放常量。

基础数据类型与栈内存
JS中的基础数据类型，这些值都有固定的大小，往往都保存在栈内存中（闭包除外），由系统自动分配存储空间。我们可以直接操作保存在栈内存空间的值，因此基础数据类型都是按值访问 数据在栈内存中的存储与使用方式类似于数据结构中的堆栈数据结构，遵循后进先出的原则。 基础数据类型： Number String Null Undefined Boolean 复习一下，此问题常常在面试中问到，然而答不出来的人大有人在 ~ ~ 要简单理解栈内存空间的存储方式，我们可以通过类比乒乓球盒子来分析。

|乒乓球盒子| |:---:| |5| |4| |3| |2| |1| 这种乒乓球的存放方式与栈中存取数据的方式如出一辙。处于盒子中最顶层的乒乓球5，它一定是最后被放进去，但可以最先被使用。而我们想要使用底层的乒乓球1，就必须将上面的4个乒乓球取出来，让乒乓球1处于盒子顶层。这就是栈空间先进后出，后进先出的特点。

引用数据类型与堆内存
与其他语言不同，JS的引用数据类型，比如数组Array，它们值的大小是不固定的。引用数据类型的值是保存在堆内存中的对象。JS不允许直接访问堆内存中的位置，因此我们不能直接操作对象的堆内存空间。在操作对象时，实际上是在操作对象的引用而不是实际的对象。因此，引用类型的值都是按引用访问的。这里的引用，我们可以粗浅地理解为保存在栈内存中的一个地址，该地址与堆内存的实际值相关联。 堆存取数据的方式，则与书架与书非常相似。 书虽然也有序的存放在书架上，但是我们只要知道书的名字，我们就可以很方便的取出我们想要的书，而不用像从乒乓球盒子里取乒乓一样，非得将上面的所有乒乓球拿出来才能取到中间的某一个乒乓球。好比在JSON格式的数据中，我们存储的key-value是可以无序的，因为顺序的不同并不影响我们的使用，我们只需要关心书的名字。

为了更好的搞懂栈内存与堆内存，我们可以结合以下例子与图解进行理解。 var a1 = 0; // 栈 var a2 = 'this is string'; // 栈 var a3 = null; // 栈 var b = { m: 20 }; // 变量b存在于栈中，{m: 20} 作为对象存在于堆内存中 var c = [1, 2, 3]; // 变量c存在于栈中，[1, 2, 3] 作为对象存在于堆内存中

|变量名|具体值| |:--:|:--:| |c|0x0012ff7d| |b|0x0012ff7c| |a3|null| |a2|this is string| |a1|0| [栈内存空间] ------->

        堆内存空间
        [1,2,3]           
                    {m：20}           
因此当我们要访问堆内存中的引用数据类型时，实际上我们首先是从栈中获取了该对象的地址引用（或者地址指针），然后再从堆内存中取得我们需要的数据。 理解了JS的内存空间，我们就可以借助内存空间的特性来验证一下引用类型的一些特点了。 在前端面试中我们常常会遇到这样一个类似的题目

// demo01.js
var a = 20;
var b = a;
b = 30;
// 这时a的值是多少？

// demo02.js
var m = { a: 10, b: 20 };
var n = m;
n.a = 15;
// 这时m.a的值是多少
在栈内存中的数据发生复制行为时，系统会自动为新的变量分配一个新值。var b = a执行之后，a与b虽然值都等于20，但是他们其实已经是相互独立互不影响的值了。具体如图。所以我们修改了b的值以后，a的值并不会发生变化。 |栈内存空间|| |:----:|:----:| |a|20| [复制前]

|栈内存空间|| |:---:|:----:| |b|20| |a|20| [复制后]

|栈内存空间|| |:-:|:-:| |b|30| |a|20| [b值修改后] 这是 demo1 的图解

在demo02中，我们通过var n = m执行一次复制引用类型的操作。引用类型的复制同样也会为新的变量自动分配一个新的值保存在栈内存中，但不同的是，这个新的值，仅仅只是引用类型的一个地址指针。当地址指针相同时，尽管他们相互独立，但是在堆内存中访问到的具体对象实际上是同一个。 |栈内存空间|| |变量名|具体值| |m|0x0012ff7d| |:-:|:-:| [复制前]

|堆内存空间| |{a:10,b:20}| |:-:| [复制前]

|栈内存空间|| |变量名|具体值| |m|0x0012ff7d| |n|0x0012ef21| |:--:|:--:| [复制后]

|堆内存空间| |{a:10,b:20}| |:-:| [复制后] 这是demo2图解

除此之外，我们还可以以此为基础，一步一步的理解JavaScript的执行上下文，作用域链，闭包，原型链等重要概念。其他的以后再说，光做这个就累死了。

内存的生命周期
JS环境中分配的内存一般有如下生命周期：

内存分配：当我们申明变量、函数、对象的时候，系统会自动为他 们分配内存
内存使用：即读写内存，也就是使用变量、函数等
内存回收：使用完毕，由垃圾回收机制自动回收不再使用的内存
为了便于理解，我们使用一个简单的例子来解释这个周期。

var a = 20;  // 在内存中给数值变量分配空间
alert(a + 100);  // 使用内存
var a = null; // 使用完毕之后，释放内存空间
第一步和第二步我们都很好理解，JavaScript在定义变量时就完成了内存分配。第三步释放内存空间则是我们需要重点理解的一个点。

现在想想，从内存来看 null 和 undefined 本质的区别是什么？

为什么typeof(null) //object typeof(undefined) //undefined？

现在再想想，构造函数和立即执行函数的声明周期是什么？

对了，ES6语法中的 const 声明一个只读的常量。一旦声明，常量的值就不能改变。但是下面的代码可以改变 const 的值，这是为什么？

const foo = {}; 
foo.prop = 123;
foo.prop // 123
foo = {}; // TypeError: "foo" is read-only
内存回收
JavaScript有自动垃圾收集机制，那么这个自动垃圾收集机制的原理是什么呢？其实很简单，就是找出那些不再继续使用的值，然后释放其占用的内存。垃圾收集器会每隔固定的时间段就执行一次释放操作。 在JavaScript中，最常用的是通过标记清除的算法来找到哪些对象是不再继续使用的，因此 a = null 其实仅仅只是做了一个释放引用的操作，让 a 原本对应的值失去引用，脱离执行环境，这个值会在下一次垃圾收集器执行操作时被找到并释放。而在适当的时候解除引用，是为页面获得更好性能的一个重要方式。

在局部作用域中，当函数执行完毕，局部变量也就没有存在的必要了，因此垃圾收集器很容易做出判断并回收。但是全局变量什么时候需要自动释放内存空间则很难判断，因此在我们的开发中，需要尽量避免使用全局变量，以确保性能问题。

以Google的V8引擎为例，在V8引擎中所有的JAVASCRIPT对象都是通过堆来进行内存分配的。当我们在代码中声明变量并赋值时，V8引擎就会在堆内存中分配一部分给这个变量。如果已申请的内存不足以存储这个变量时，V8引擎就会继续申请内存，直到堆的大小达到了V8引擎的内存上限为止（默认情况下，V8引擎的堆内存的大小上限在64位系统中为1464MB，在32位系统中则为732MB）。

另外，V8引擎对堆内存中的JAVASCRIPT对象进行分代管理。新生代：新生代即存活周期较短的JAVASCRIPT对象，如临时变量、字符串等； 老生代：老生代则为经过多次垃圾回收仍然存活，存活周期较长的对象，如主控制器、服务器对象等。

请各位老铁see一下以下的代码，来分析一下垃圾回收。

function fun1() {
    var obj = {name: 'csa', age: 24};
}
 
function fun2() {
    var obj = {name: 'coder', age: 2}
    return obj;
}
 
var f1 = fun1();
var f2 = fun2();
在上述代码中，当执行var f1 = fun1();的时候，执行环境会创建一个{name:'csa', age:24}这个对象，当执行var f2 = fun2();的时候，执行环境会创建一个{name:'coder', age=2}这个对象，然后在下一次垃圾回收来临的时候，会释放{name:'csa', age:24}这个对象的内存，但并不会释放{name:'coder', age:2}这个对象的内存。这就是因为在fun2()函数中将{name:'coder, age:2'}这个对象返回，并且将其引用赋值给了f2变量，又由于f2这个对象属于全局变量，所以在页面没有卸载的情况下，f2所指向的对象{name:'coder', age:2}是不会被回收的。 由于JavaScript语言的特殊性(闭包...)，导致如何判断一个对象是否会被回收的问题上变的异常艰难，各位老铁看看就行。

垃圾回收算法
对垃圾回收算法来说，核心思想就是如何判断内存已经不再使用了。

引用计数算法
熟悉或者用C语言搞过事的同学的都明白，引用无非就是指向某一物体的指针。对不熟悉这个语言的同学来说，可简单将引用视为一个对象访问另一个对象的路径。（这里的对象是一个宽泛的概念，泛指JS环境中的实体）。

引用计数算法定义“内存不再使用”的标准很简单，就是看一个对象是否有指向它的引用。如果没有其他对象指向它了，说明该对象已经不再需了。

老铁们来看一个例子：

// 创建一个对象person，他有两个指向属性age和name的引用
var person = {
    age: 12,
    name: 'aaaa'
};

person.name = null; // 虽然设置为null，但因为person对象还有指向name的引用，因此name不会回收

var p = person; 
person = 1;         //原来的person对象被赋值为1，但因为有新引用p指向原person对象，因此它不会被回收

p = null;           //原person对象已经没有引用，很快会被回收
由上面可以看出，引用计数算法是个简单有效的算法。但它却存在一个致命的问题：循环引用。如果两个对象相互引用，尽管他们已不再使用，垃圾回收器不会进行回收，导致内存泄露。

老铁们再来看一个例子：

function cycle() {
    var o1 = {};
    var o2 = {};
    o1.a = o2;
    o2.a = o1; 

    return "Cycle reference!"
}

cycle();
上面我们申明了一个cycle方程，其中包含两个相互引用的对象。在调用函数结束后，对象o1和o2实际上已离开函数范围，因此不再需要了。但根据引用计数的原则，他们之间的相互引用依然存在，因此这部分内存不会被回收，内存泄露不可避免了。 正是因为有这个严重的缺点，这个算法在现代浏览器中已经被下面要介绍的标记清除算法所取代了。但绝不可认为该问题已经不再存在了，因为还占有大量市场的IE老祖宗们使用的正是这一算法。在需要照顾兼容性的时候，某些看起来非常普通的写法也可能造成意想不到的问题：

var div = document.createElement("div");
div.onclick = function() {
    console.log("click");
};
上面这种JS写法再普通不过了，创建一个DOM元素并绑定一个点击事件。那么这里有什么问题呢？请注意，变量div有事件处理函数的引用，同时事件处理函数也有div的引用！（div变量可在函数内被访问）。一个循序引用出现了，按上面所讲的算法，该部分内存无可避免地泄露哦了。 现在你明白为啥前端程序员都讨厌IE了吧？拥有超多BUG并依然占有大量市场的IE是前端开发一生之敌！亲，没有买卖就没有杀害。

标记清除算法
上面说过，现代的浏览器已经不再使用引用计数算法了。现代浏览器通用的大多是基于标记清除算法的某些改进算法，总体思想都是一致的。

标记清除算法将“不再使用的对象”定义为“无法达到的对象”。简单来说，就是从根部（在JS中就是全局对象）出发定时扫描内存中的对象。凡是能从根部到达的对象，都是还需要使用的。那些无法由根部出发触及到的对象被标记为不再使用，稍后进行回收。

从这个概念可以看出，无法触及的对象包含了没有引用的对象这个概念（没有任何引用的对象也是无法触及的对象）。但反之未必成立。

根据这个概念，上面的例子可以正确被垃圾回收处理了(亲，想想为什么？)。

当div与其时间处理函数不能再从全局对象出发触及的时候，垃圾回收器就会标记并回收这两个对象。

如何写出对内存管理友好的JS代码？
如果还需要兼容老旧浏览器，那么就需要注意代码中的循环引用问题。或者直接采用保证兼容性的库来帮助优化代码。

对现代浏览器来说，唯一要注意的就是明确切断需要回收的对象与根部的联系。有时候这种联系并不明显，且因为标记清除算法的强壮性，这个问题较少出现。最常见的内存泄露一般都与DOM元素绑定有关：

email.message = document.createElement(“div”);
displayList.appendChild(email.message);

// 稍后从displayList中清除DOM元素
displayList.removeAllChildren();
div元素已经从DOM树中清除，也就是说从DOM树的根部无法触及该div元素了。但是请注意，div元素同时也绑定了email对象。所以只要email对象还存在，该div元素将一直保存在内存中。

小结
如果你的引用只包含少量JS交互，那么内存管理不会对你造成太多困扰。一旦你开始构建中大规模的SPA(比如我们现在做的坑爹的华为云)或是服务器和桌面端的应用，那么就应当将内存泄露提上日程了。不要满足于写出能运行的程序，也不要认为机器的升级就能解决一切。

内存泄露
靠……不想写了。 算了，随便写一点吧。

什么是内存泄露
对于持续运行的服务进程（daemon），必须及时释放不再用到的内存。否则，内存占用越来越高，轻则影响系统性能，重则导致进程崩溃。 不再用到的内存，没有及时释放，就叫做内存泄漏（memory leak）。 有些语言（比如 C 语言）必须手动释放内存，程序员负责内存管理。

char * buffer;
buffer = (char*) malloc(42);

// Do something with buffer

free(buffer);
看不懂没关系，上面是 C 语言代码，malloc方法用来申请内存，使用完毕之后，必须自己用free方法释放内存。 这很麻烦，所以大多数语言提供自动内存管理，减轻程序员的负担，这被称为"垃圾回收机制"（garbage collector），已经提过，不再多讲。

内存泄漏的识别方法
怎样可以观察到内存泄漏呢？ 经验法则是，如果连续五次垃圾回收之后，内存占用一次比一次大，就有内存泄漏。(咳咳，不装逼了) 这要我们实时查看内存占用。

浏览器方法
打开开发者工具，选择 Timeline 面板
在顶部的Capture字段里面勾选 Memory
点击左上角的录制按钮。
在页面上进行各种操作，模拟用户的使用情况。
一段时间后，点击对话框的 stop 按钮，面板上就会显示这段时间的内存占用情况。
如果内存占用基本平稳，接近水平，就说明不存在内存泄漏。 反之，就是内存泄漏了。

命令行方法
命令行可以使用 Node 提供的 process.memoryUsage 方法。

console.log(process.memoryUsage());
// { rss: 27709440,
//  heapTotal: 5685248,
//  heapUsed: 3449392,
//  external: 8772 }
process.memoryUsage返回一个对象，包含了 Node 进程的内存占用信息。该对象包含四个字段，单位是字节，含义如下。

Resident Set(常驻内存)
Code Segment(代码区)
Stack(Local Variables, Pointers)
Heap(Objects, Closures)
Used Heap
rss（resident set size）：所有内存占用，包括指令区和堆栈。
heapTotal："堆"占用的内存，包括用到的和没用到的。
heapUsed：用到的堆的部分。
external： V8 引擎内部的 C++ 对象占用的内存。
判断内存泄漏，以heapUsed字段为准。

WeakMap
前面说过，及时清除引用非常重要。但是，你不可能记得那么多，有时候一疏忽就忘了，所以才有那么多内存泄漏。

最好能有一种方法，在新建引用的时候就声明，哪些引用必须手动清除，哪些引用可以忽略不计，当其他引用消失以后，垃圾回收机制就可以释放内存。这样就能大大减轻程序员的负担，你只要清除主要引用就可以了。

ES6 考虑到了这一点，推出了两种新的数据结构：WeakSet 和 WeakMap。它们对于值的引用都是不计入垃圾回收机制的，所以名字里面才会有一个"Weak"，表示这是弱引用。

下面以 WeakMap 为例，看看它是怎么解决内存泄漏的。

const wm = new WeakMap();

const element = document.getElementById('example');

wm.set(element, 'some information');
wm.get(element) // "some information"
上面代码中，先新建一个 Weakmap 实例。然后，将一个 DOM 节点作为键名存入该实例，并将一些附加信息作为键值，一起存放在 WeakMap 里面。这时，WeakMap 里面对element的引用就是弱引用，不会被计入垃圾回收机制。

也就是说，DOM 节点对象的引用计数是1，而不是2。这时，一旦消除对该节点的引用，它占用的内存就会被垃圾回收机制释放。Weakmap 保存的这个键值对，也会自动消失。

基本上，如果你要往对象上添加数据，又不想干扰垃圾回收机制，就可以使用 WeakMap。

WeakMap 示例
WeakMap 的例子很难演示，因为无法观察它里面的引用会自动消失。此时，其他引用都解除了，已经没有引用指向 WeakMap 的键名了，导致无法证实那个键名是不是存在。 （具体可以去看阮一峰老师的内存泄露文章）。 over.