const baseData = [1,2,3,4,5,6,100];

// const asyncRun = (arr, fn) => {
//  for(var i=0; i<arr.length; i++) {
//    setTimeout( () => fn(i), 1000);
//  }
// }

// asyncRun(baseData, idx =>console.log(idx));

// const asyncRun = (arr, fn) => {
//    arr.forEach((v,i) => {
//      setTimeout( () => fn(i), 1000);
//    });
// }
// asyncRun(baseData, idx =>console.log(idx))

// function sync() {
//     baseData.forEach((v,i) => {
//       console.log("sync ", i);
//     });
//   }
  
//   const asyncRun = (arr, fn) => {
//      arr.forEach((v,i) => {
//        setTimeout( () => fn(i), 1000);
//      });
//   }
  
  
//   function sync2() {
//     baseData.forEach((v,i) => {
//       console.log("sync 2 ", i);
//     });
//   }
  
//   asyncRun(baseData, idx =>console.log(idx))
//   sync();
//   sync2();

const asyncRun = (arr, fn) => {
   arr.forEach((v,i) => {
     setTimeout(() => {
       setTimeout(() => {
         console.log("cb 2");
         fn(i)
        },1000);
       console.log("cb 1");
     }, 1000);
   });
}

asyncRun(baseData, idx =>console.log(idx))