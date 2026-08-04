import { useEffect, useState } from "react";
import api from "../api/api";

import {
  FaUsers,
  FaUserPlus,
  FaPhone,
  FaCheckCircle,
  FaFileInvoice,
  FaTrophy,
  FaTimesCircle,
} from "react-icons/fa";



function Analytics() {


const [data,setData]=useState([]);




useEffect(()=>{

 loadAnalytics();

},[]);





const loadAnalytics=async()=>{

try{

const res=await api.get("/api/analytics");

setData(res.data);


}
catch(err){

console.log(err);

}

};







const getCount=(status)=>{

const item=data.find(
x=>x.status===status
);


return item
?
Number(item.total)
:
0;


};







const totalLeads=data.reduce(

(sum,item)=>

sum + Number(item.total),

0

);





const wonLeads=getCount("Won");





const conversionRate=

totalLeads

?

Math.round(
(wonLeads / totalLeads)*100
)

:

0;









const cards=[

{
title:"New",
value:getCount("New"),
icon:<FaUserPlus/>,
color:"bg-slate-500"
},


{
title:"Contacted",
value:getCount("Contacted"),
icon:<FaPhone/>,
color:"bg-blue-600"
},


{
title:"Qualified",
value:getCount("Qualified"),
icon:<FaCheckCircle/>,
color:"bg-indigo-600"
},


{
title:"Proposal",
value:getCount("Proposal"),
icon:<FaFileInvoice/>,
color:"bg-orange-500"
},


{
title:"Won",
value:getCount("Won"),
icon:<FaTrophy/>,
color:"bg-green-600"
},


{
title:"Lost",
value:getCount("Lost"),
icon:<FaTimesCircle/>,
color:"bg-red-600"
},


];








return (

<div>


<h1

className="
text-3xl
font-bold
mb-6
text-slate-800
"

>

Analytics

</h1>







{/* Total Leads */}


<div

className="
bg-white
rounded-2xl
shadow-md
p-6
mb-8
"

>


<div

className="
flex
justify-between
items-center
"

>


<div>

<p className="text-gray-500">

Total Leads

</p>


<h2

className="
text-4xl
font-bold
mt-2
"

>

{totalLeads}

</h2>


</div>





<div

className="
bg-blue-600
w-16
h-16
rounded-xl
flex
items-center
justify-center
text-white
text-3xl
"

>

<FaUsers/>


</div>


</div>


</div>









{/* Status Cards */}


<div

className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-3
gap-5
"

>


{

cards.map((item,index)=>(


<div

key={index}

className="
bg-white
rounded-2xl
shadow-md
p-5
hover:-translate-y-1
transition
"

>


<div

className="
flex
justify-between
items-center
"

>


<div>


<p className="text-gray-500">

{item.title}

</p>


<h2

className="
text-3xl
font-bold
mt-2
"

>

{item.value}

</h2>


</div>





<div

className={`
${item.color}

w-14
h-14

rounded-xl

flex
items-center
justify-center

text-white
text-xl

`}

>

{item.icon}

</div>



</div>


</div>



))


}



</div>









{/* Conversion */}



<div

className="
mt-8
bg-white
rounded-2xl
shadow-md
p-6
"

>


<div

className="
flex
justify-between
mb-4
"

>


<h2

className="
text-xl
font-bold
"

>

Conversion Rate

</h2>


<span

className="
text-green-600
font-bold
"

>

{conversionRate}%

</span>


</div>






<div

className="
h-5
bg-gray-200
rounded-full
overflow-hidden
"

>


<div

className="
h-full
bg-green-500
rounded-full
transition-all
duration-700
"

style={{

width:`${conversionRate}%`

}}


/>


</div>




<p

className="
text-sm
text-gray-500
mt-3
"

>

Won Leads / Total Leads

</p>



</div>







</div>

);


}


export default Analytics;