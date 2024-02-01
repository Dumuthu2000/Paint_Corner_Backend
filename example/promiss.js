// const genereteNumber = new Promise((resolve, reject)=>{
//     const randomNumber = Math.floor(Math.random()*10)
//     if(randomNumber >= 5){
//         resolve("The number is "+randomNumber);
//     }else{
//         reject("Error: the number is less than 5");
//     }
// })

// genereteNumber.then((result)=>{
//     console.log(result);
// }).catch((err)=>{
//     console.log(err)
// })

function genereteNumber(){
    return new Promise((resolve, reject)=>{
        const randomNumber = Math.floor(Math.random()*10);
        if(randomNumber >= 5){
            resolve("Number is "+randomNumber);
        }else{
            reject("The number is less than 5");
        }
    })
}

genereteNumber().then((result)=>{
    console.log(result);
}).catch((error)=>{
    console.log(error);
})