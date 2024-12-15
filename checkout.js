//load orders to checkout page

document.addEventListener("DOMContentLoaded",function(){
    const orderData=JSON.parse(localStorage.getItem("favoriteOrder"))||{};
    const medicineData=JSON.parse(localStorage.getItem("medicineData"))||[];
    const tbody=document.querySelector("#order-summary tbody");
    const totalPriceElement = document.getElementById("totalPrice");

    let totalPrice=0;

    Object.keys(orderData).forEach(itemName=>{
        const quantity=parseInt(orderData[itemName],10);
        const medicine=medicineData.find(m=>m.name===itemName);
        if(medicine){
            const price=medicine.price*quantity;
            totalPrice+=price;

            const row=document.createElement("tr");
            row.innerHTML=`
            <td>${medicine.name}</td>
            <td>${quantity}</td>
            <td>Rs.${price}</td>`;
            tbody.append(row);

        }
        totalPriceElement.textContent=`Total price: Rs.${totalPrice}`;
    })
});

//pay function
const btnPay=document.getElementById("payButton");
btnPay.addEventListener("click",()=>{
    const cForm=document.getElementById("checkoutForm");

    if(cForm.checkValidity()){
        const deliveryDate=new Date();
        deliveryDate.setDate(deliveryDate.getDate()+2);
        alert(`Thank you for purchasing medicine from our pharmacy!  your order will be delivered on ${deliveryDate.toDateString()}`);

        localStorage.removeItem("favoriteOrder");

        window.location.href="index.html";

    }
    else{
        alert("Please fill the all fields correctly!")
    }
});



