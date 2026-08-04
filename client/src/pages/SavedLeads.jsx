import { useEffect, useState, useRef } from "react";
import api from "../api/api";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";

import { FaWhatsapp } from "react-icons/fa";



function SavedLeads() {



const [leads,setLeads]=useState([]);

const [globalFilter,setGlobalFilter]=useState("");

const [statusFilter,setStatusFilter]=useState("All");



const [visible,setVisible]=useState(false);

const [selectedLead,setSelectedLead]=useState(null);


const [status,setStatus]=useState("New");

const [notes,setNotes]=useState("");

const [followup,setFollowup]=useState(null);



const dt=useRef(null);






const statuses=[

"New",
"Contacted",
"Qualified",
"Proposal",
"Won",
"Lost"

];



const statusOptions = [

{
 label:"All Status",
 value:"All"
},

{
 label:"New",
 value:"New"
},

{
 label:"Contacted",
 value:"Contacted"
},

{
 label:"Qualified",
 value:"Qualified"
},

{
 label:"Proposal",
 value:"Proposal"
},

{
 label:"Won",
 value:"Won"
},

{
 label:"Lost",
 value:"Lost"
}

];





useEffect(()=>{

fetchLeads();

},[]);








const fetchLeads=async()=>{

try{

const res=await api.get("/api/saved-leads");

setLeads(res.data);


}
catch(err){

console.log(err);

}


};









// Status Filter

const filteredLeads =
statusFilter === "All"

?

leads

:

leads.filter(
lead => lead.status === statusFilter
);







// WhatsApp


const openWhatsApp=(row)=>{


if(!row.phone){

alert("Phone number not available");

return;

}



let phone = row.phone.replace(/\D/g, "");

if (phone.startsWith("91") && phone.length === 12) {
  // Already correct
} else {
  phone = phone.replace(/^0+/, "");

  if (phone.length === 10) {
    phone = "91" + phone;
  }
}


const message=

`Hi Sir/Madam,

Greetings from Code6 Technologies.

Regarding:
${row.business_name}

${row.address || ""}


We provide:

• Website Design
• School Website
• E-Commerce Website
• Logo Design
• SEO & Digital Marketing


Contact:
Moorthi

+91 9629301506`;


const url=

`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;


window.open(url,"_blank");


};









// Delete


const deleteLead=async(id)=>{


if(!window.confirm("Delete this lead?"))

return;



try{

await api.delete(
`/api/saved-leads/${id}`
);


fetchLeads();


}
catch(err){

console.log(err);

}


};









// Edit


const editLead=(lead)=>{


setSelectedLead(lead);


setStatus(
lead.status || "New"
);


setNotes(
lead.notes || ""
);



if(lead.followup_date){

setFollowup(
new Date(lead.followup_date)
);


}

else{

setFollowup(null);

}



setVisible(true);


};









const formatDate=(date)=>{


if(!date)

return null;


const y=date.getFullYear();

const m=String(
date.getMonth()+1
).padStart(2,"0");


const d=String(
date.getDate()
).padStart(2,"0");



return `${y}-${m}-${d}`;


};









const updateLead=async()=>{


try{


await api.put(

`/api/update-lead/${selectedLead.id}`,

{

status,

notes,

followup_date:
followup
?
formatDate(followup)
:
null

}

);



setVisible(false);


fetchLeads();


alert(
"Lead Updated Successfully"
);



}

catch(err){

console.log(err);

}


};









// Templates


const websiteBody=(row)=>(

row.website

?

<a

href={row.website}

target="_blank"

rel="noreferrer"

className="text-blue-600"

>

Visit

</a>

:

"-"

);








const ratingBody=(row)=>(

<span>

⭐ {row.rating || "-"}

</span>

);









const followupBody=(row)=>{


if(!row.followup_date)

return "-";


return new Date(
row.followup_date
).toLocaleDateString(
"en-IN"
);


};









const statusBody=(row)=>{


const colors={

New:"bg-gray-200 text-gray-700",

Contacted:"bg-blue-100 text-blue-700",

Qualified:"bg-indigo-100 text-indigo-700",

Proposal:"bg-yellow-100 text-yellow-700",

Won:"bg-green-100 text-green-700",

Lost:"bg-red-100 text-red-700"

};



return (

<span

className={`
px-3
py-1
rounded-full
text-sm
font-semibold
${colors[row.status]}
`}

>

{row.status}

</span>

);


};









const actionBody=(row)=>(


<div

className="
flex
gap-2
"

>


<Button

icon="pi pi-pencil"

severity="warning"

onClick={()=>
editLead(row)
}

/>



<Button

icon="pi pi-trash"

severity="danger"

onClick={()=>
deleteLead(row.id)
}

/>



<button

onClick={()=>
openWhatsApp(row)
}

className="
bg-green-500
hover:bg-green-600
text-white
rounded-lg
px-3
"

>

<FaWhatsapp/>

</button>



</div>


);









const exportCSV=()=>{


dt.current.exportCSV();


};









return (

<div>


<div

className="
flex
flex-col
md:flex-row

justify-between

gap-4

mb-6
"

>


<h1

className="
text-3xl
font-bold
"

>

Saved Leads

</h1>





<div

className="
flex
flex-wrap
gap-3
"

>



<Dropdown

value={statusFilter}

options={statusOptions}

onChange={(e)=>
setStatusFilter(e.value)
}

placeholder="Filter Status"

className="w-44"

/>



<InputText

placeholder="Search..."

value={globalFilter}

onChange={(e)=>
setGlobalFilter(e.target.value)
}

/>



<Button

label="Export CSV"

icon="pi pi-download"

onClick={exportCSV}

/>



</div>


</div>








<DataTable


ref={dt}

value={filteredLeads}

paginator

rows={10}

rowsPerPageOptions={[10,20,50]}

stripedRows

showGridlines

globalFilter={globalFilter}

responsiveLayout="scroll"

emptyMessage="No Saved Leads"


>



<Column

field="business_name"

header="Business"

sortable

/>



<Column

field="phone"

header="Phone"

/>



<Column

header="Website"

body={websiteBody}

/>



<Column

field="rating"

header="Rating"

body={ratingBody}

/>



<Column

field="address"

header="Address"

/>



<Column

header="Status"

body={statusBody}

/>



<Column

header="Followup"

body={followupBody}

/>



<Column

field="notes"

header="Notes"

/>



<Column

header="Action"

body={actionBody}

/>



</DataTable>








<Dialog

header="Update Lead"

visible={visible}

style={{
width:"500px"
}}

onHide={()=>
setVisible(false)
}

>


<div

className="
flex
flex-col
gap-4
"

>



<Dropdown

value={status}

options={statuses}

onChange={(e)=>
setStatus(e.value)
}

/>



<Calendar

value={followup}

onChange={(e)=>
setFollowup(e.value)
}

showIcon

dateFormat="dd/mm/yy"

/>



<InputTextarea

rows={5}

value={notes}

onChange={(e)=>
setNotes(e.target.value)
}

placeholder="Notes"

/>



<Button

label="Save Changes"

icon="pi pi-check"

onClick={updateLead}

/>



</div>


</Dialog>





</div>

);


}


export default SavedLeads;