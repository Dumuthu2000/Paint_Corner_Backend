function getData(key){
    return new Promise((resolve, reject)=>{
        console.log("Getting Data.....")
        setTimeout(()=>{
            if(key === "abc123"){
                const data = "Raw data";
                resolve(data)
            }else{
                reject("Invalid Key");
            }
        }, 1000);
    })
}

function processData(rawData){
    return new Promise((resolve, reject)=>{
        console.log("Processing Data........")
        setTimeout(()=>{
            const processData = rawData+" is processed";
            resolve(processData);
        },1000)
    })
}

function formatData(processedData){
    return new Promise((resolve, reject)=>{
        console.log("Formmting data.......")
        setTimeout(()=>{
            const formattedData = processedData +" and formatted";
            resolve(formattedData); 
        }, 1000)
    })
}

function displayData(){
    getData("abc123").then((result)=>{
        return processData(result);
    }).then((result)=>{
        return formatData(result)
    }).then((result)=>{
        console.log("Displaying", result)
    }).catch((err)=>{
        console.log(err)
    })
}

displayData();