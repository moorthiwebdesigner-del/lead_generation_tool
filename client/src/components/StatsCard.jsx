import {
  FaDatabase,
  FaCalendarDay,
  FaStar,
  FaChartLine,
  FaUserCheck,
  FaFileInvoiceDollar,
  FaTrophy,
  FaTimesCircle,
} from "react-icons/fa";


function StatsCard({ stats }) {


const cards = [

{
 title:"Total Saved Leads",
 value:stats?.totalLeads || 0,
 icon:<FaDatabase />,
 color:"bg-blue-500"
},


{
 title:"Today's Leads",
 value:stats?.todayLeads || 0,
 icon:<FaCalendarDay />,
 color:"bg-green-500"
},


{
 title:"New",
 value:stats?.newLeads || 0,
 icon:<FaChartLine />,
 color:"bg-slate-500"
},


{
 title:"Contacted",
 value:stats?.contactedLeads || 0,
 icon:<FaUserCheck />,
 color:"bg-blue-600"
},


{
 title:"Qualified",
 value:stats?.qualifiedLeads || 0,
 icon:<FaUserCheck />,
 color:"bg-indigo-600"
},


{
 title:"Proposal",
 value:stats?.proposalLeads || 0,
 icon:<FaFileInvoiceDollar />,
 color:"bg-orange-500"
},


{
 title:"Won",
 value:stats?.wonLeads || 0,
 icon:<FaTrophy />,
 color:"bg-emerald-600"
},


{
 title:"Lost",
 value:stats?.lostLeads || 0,
 icon:<FaTimesCircle />,
 color:"bg-red-600"
}

];




return (

<div

className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
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

hover:shadow-xl
hover:-translate-y-1

transition
duration-300

border
border-gray-100

"

>


<div

className="
flex
items-center
justify-between
"

>



<div>


<p

className="
text-gray-500
text-sm
font-medium
"

>

{item.title}

</p>



<h2

className="
text-3xl
font-bold
mt-2
text-slate-800
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

text-2xl

shadow-lg

`}

>

{item.icon}


</div>




</div>



</div>


))


}


</div>


);


}


export default StatsCard;