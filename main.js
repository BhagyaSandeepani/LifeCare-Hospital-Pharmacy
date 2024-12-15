//get referencees to interactive elements
const txtDirectory=document.getElementById("directory");
const btnAddToFavorites = document.getElementById("add-to-favorites");
const btnApplyFavorite = document.getElementById("apply-favorites");
const btnBuyNow = document.getElementById("buyNow");
const medicineContainer=document.getElementById("medicine");

//get medicine data from the Directory
loadData();
function loadData(){
    fetch('directory.json')
    .then(res=>res.json())
    .then(data=>fillOrderForm(data.medicine))
    .catch(error=>console.log(`(Error - ${error})`))
}
//load form with medicine from json file
function fillOrderForm(medicine) {
    //create div for each medicine array
    medicine.forEach(category =>{
        const categorySection=document.createElement("div");
        categorySection.classList.add("category-section");

        //create heading for each medicine
        const categoryHeading=document.createElement("h2");
        categoryHeading.textContent=category.category;
        categorySection.appendChild(categoryHeading);

        //load medicine names, images and label for each category
        category.items.forEach(item=>{
            const medicineItem=document.createElement("div");
            medicineItem.classList.add("medicine-item");

            const img=document.createElement("img");
            img.src=item.image;
            img.alt=item.name;
            medicineItem.appendChild(img);

            const label =document.createElement("label");
            label.setAttribute("for",item.name);
            label.textContent =`${item.name} - Rs.${item.price}`;
            medicineItem.appendChild(label);

            const input=document.createElement("input");
            input.type="number";
            input.id=item.name;
            input.name=item.name;
            input.value="0";
            input.min="1";
            input.dataset.price=parseFloat(item.price);
            input.addEventListener("input",updateOrderDetails);
            medicineItem.appendChild(input);

            categorySection.appendChild(medicineItem);
        });
        medicineContainer.appendChild(categorySection);
    });
    updateOrderSummary();
}

//update order data
function  updateOrderDetails(){
    const orderData={};
    const formData=new FormData(document.getElementById("medicine-form"));
    formData.forEach((value,key)=>{
        if(parseInt(value)>0){
            orderData[key]=value;

        }
    });
    localStorage.setItem("favoriteOrder",JSON.stringify(orderData));
    updateOrderSummary();
}

//update order summary table according to selections and quantity changes
function updateOrderSummary(){
    const tbody= document.querySelector("#order-summary tbody");
    tbody.innerHTML='';

    let totalPrice=0;
    const formData=new FormData(document.getElementById("medicine-form"));
    formData.forEach((value,key)=>{
        if (parseInt(value)>0){
            const inputData=(document.getElementById(key));
            const categorySection=inputData.closest(".category-section");
            const img=categorySection.querySelector(`img[alt="${key}"]`);

            if (!img){
                console.error(`img not found`);
                return;
            }
            const imageSrc=img.src;
            const price=parseFloat(inputData.dataset.price);

            const row = document.createElement("tr");

            const imageDisplay  = document.createElement("td");
            const imageData =document.createElement("img");
            imageData.src=imageSrc;
            imageData.alt=key;
            imageData.classList.add("order-image");

            const itemName=document.createElement("itemLabel");
            itemName.textContent=key;
            itemName.classList.add("item-name");

            imageDisplay.appendChild(imageData);
            imageDisplay.appendChild(document.createElement("br"));
            imageDisplay.appendChild(itemName);

            const quantityDisplay=document.createElement("td");
            quantityDisplay .textContent=value;

            const priceDisplay=document.createElement("td");
            priceDisplay.textContent=`Rs.${(parseInt(value)*price)}`;

            row.appendChild(imageDisplay);
            row.appendChild(quantityDisplay);
            row.appendChild(priceDisplay);
            tbody.appendChild(row);

            totalPrice+=parseInt(value)*price;

        }
    });

    document.getElementById("totalPrice").textContent = `Total price: Rs.${totalPrice}`;
}

//add to favorite function
btnAddToFavorites.addEventListener("click", function(){
    const orderData={};
    const formData=new FormData(document.getElementById("medicine-form"));
    formData.forEach((value,key)=>{
        if(parseInt(value)>0){
            orderData[key]=value;

        }
    });
    
    localStorage.setItem("favoriteOrder",JSON.stringify(orderData));
    alert("Your order saved as favorites!")
    
    });


//apply favorite function
btnApplyFavorite.addEventListener("click",function(){
    const favorites=JSON.parse(localStorage.getItem("favoriteOrder")) ||{};
    if (Object.keys(favorites).length===0){
        alert("No saved favorite order found!");
        return;
    }
    //load favorite items to table from local storage
    for (let key in favorites){
        const inputData=document.getElementById(key);
        if(inputData){
            inputData.value=favorites[key];
        }
        else{
            console.warn(`input element with '${key}'not found.`);

        }
    }
    alert("Favorite items has been applied!")
    updateOrderSummary();
    
});

//Clear favorite function
btnClearFavorites=document.getElementById("clearFavorites");
btnClearFavorites.addEventListener("click",()=>{
    localStorage.removeItem("favoriteOrder");

    document.querySelector("#order-summary tbody").innerHTML='';
    document.getElementById("totalPrice").textContent="Total price:$0";

    alert("Your favorute have been cleared.")
});

//buy now function
btnBuyNow.addEventListener("click",function(){
    const medicineData=[...document.querySelectorAll("#medicine input")].map(input=>({
        name:input.name,
        price:parseInt(input.dataset.price||0),
    }));
    localStorage.setItem("medicineData",JSON.stringify(medicineData));

    window.location.href="checkout.html";
});





