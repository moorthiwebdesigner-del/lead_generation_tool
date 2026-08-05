import { 
  useEffect, 
  useState, 
  useRef 
} from "react";


import api from "../api/api";

import SavedLeadCard from "../components/SavedLeadCard";


import { DataTable } from "primereact/dataTable";
import { Column } from "primereact/column";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";

import { Toast } from "primereact/toast";


import {
 ConfirmDialog,
 confirmDialog
} from "primereact/confirmdialog";


import { FaWhatsapp } from "react-icons/fa";




function SavedLeads(){


const [leads,setLeads]=useState([]);

const [globalFilter,setGlobalFilter]=useState("");

const [statusFilter,setStatusFilter]=useState("All");


// popup

const [visible,setVisible]=useState(false);

const [selectedLead,setSelectedLead]=useState(null);


const [status,setStatus]=useState("New");

const [notes,setNotes]=useState("");

const [followup,setFollowup]=useState(null);



const [isMobile,setIsMobile]=useState(false);



const dt=useRef(null);

const toast=useRef(null);





const statuses=[

"New",
"Contacted",
"Qualified",
"Proposal",
"Won",
"Lost"

];




const statusOptions=[

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


const resize=()=>{

setIsMobile(
window.innerWidth < 768
);

};


resize();


window.addEventListener(
"resize",
resize
);



return ()=>{

window.removeEventListener(
"resize",
resize
);

};


},[]);






const fetchLeads=async()=>{


try{


const res =
await api.get("/api/saved-leads");



setLeads(

Array.isArray(res.data)

?

res.data

:

res.data.leads || []

);


}

catch(err){

console.log(err);


toast.current.show({

severity:"error",

summary:"Error",

detail:"Unable to load leads",

life:3000

});


}


};





const filteredLeads =

statusFilter==="All"

?

leads

:

leads.filter(

lead=>lead.status===statusFilter

);





// WhatsApp

const openWhatsApp=(row)=>{


if(!row.phone){


toast.current.show({

severity:"warn",

summary:"No Phone",

detail:"Phone number not available",

life:3000

});


return;

}



let phone =
row.phone.replace(/\D/g,"");



if(phone.length===10){

phone="91"+phone;

}



const message=

`Hi Sir/Madam,

Greetings from Code6 Technologies.

Regarding:
${row.business_name}


We provide:

• Website Design
• E-Commerce Website
• SEO
• Digital Marketing


Contact:
Moorthi

+91 9629301506`;



const url=

`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;


window.open(url,"_blank");


};
// Delete Lead

const deleteLead = async(id)=>{

try{


await api.delete(
 `/api/saved-leads/${id}`
);



await fetchLeads();



toast.current.show({

severity:"success",

summary:"Deleted",

detail:"Lead deleted successfully",

life:3000

});


}

catch(err){


console.log(err);



toast.current.show({

severity:"error",

summary:"Delete Failed",

detail:
err.response?.data?.message ||
"Unable to delete lead",

life:3000

});


}


};





// Delete Confirmation

const confirmDelete=(id)=>{


confirmDialog({

message:
"Are you sure you want to delete this lead?",


header:
"Delete Confirmation",


icon:
"pi pi-exclamation-triangle",



accept:()=>deleteLead(id),


reject:()=>{


toast.current.show({

severity:"info",

summary:"Cancelled",

detail:"Delete cancelled",

life:2000

});


}


});


};







// Edit Popup Open

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

new Date(
lead.followup_date
)

);


}

else{


setFollowup(null);


}



setVisible(true);


};








// Date Format

const formatDate=(date)=>{


if(!date)

return null;



const y =
date.getFullYear();


const m =
String(
date.getMonth()+1
)
.padStart(2,"0");


const d =
String(
date.getDate()
)
.padStart(2,"0");



return `${y}-${m}-${d}`;


};







// Update Lead

const updateLead=async()=>{


if(!selectedLead)

return;



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



await fetchLeads();



toast.current.show({

severity:"success",

summary:"Updated",

detail:"Lead updated successfully",

life:3000


});



}

catch(err){


console.log(err);



toast.current.show({

severity:"error",

summary:"Update Failed",

detail:
err.response?.data?.message ||
"Unable to update lead",

life:3000


});


}


};










// Website Column

const websiteBody=(row)=>{


return row.website ?


<a

href={row.website}

target="_blank"

rel="noreferrer"

className="
text-blue-600
hover:underline
"

>

Visit

</a>


:

"-";


};








// Rating

const ratingBody=(row)=>(

<span>

⭐ {row.rating || "-"}

</span>

);








// Followup Date

const followupBody=(row)=>{


if(!row.followup_date)

return "-";



return new Date(

row.followup_date

)
.toLocaleDateString(
"en-IN"
);


};









// Status Badge

const statusBody=(row)=>{


const colors={


New:
"bg-gray-200 text-gray-700",


Contacted:
"bg-blue-100 text-blue-700",


Qualified:
"bg-indigo-100 text-indigo-700",


Proposal:
"bg-yellow-100 text-yellow-700",


Won:
"bg-green-100 text-green-700",


Lost:
"bg-red-100 text-red-700"


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

{row.status || "New"}

</span>

);


};









// Action Buttons


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

tooltip="Edit"

onClick={()=>editLead(row)}

/>



<Button

icon="pi pi-trash"

severity="danger"

tooltip="Delete"

onClick={()=>confirmDelete(row.id)}

/>




<button

onClick={()=>openWhatsApp(row)}

className="
bg-green-500
hover:bg-green-600
text-white
px-3
rounded-lg
"

>

<FaWhatsapp/>

</button>



</div>


);







// Export CSV

const exportCSV=()=>{


dt.current.exportCSV();


};
return (

<div className="space-y-6">


<Toast ref={toast}/>

<ConfirmDialog />



{/* Header */}

<div

className="
flex
flex-col
md:flex-row
justify-between
items-center
gap-4
"

>


<h1

className="
text-3xl
font-bold
text-slate-800
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


className="w-full md:w-44"

/>





<InputText


placeholder="Search Leads..."


value={globalFilter}


onChange={(e)=>
setGlobalFilter(e.target.value)
}


className="w-full md:w-64"

/>






<Button


label="Export CSV"


icon="pi pi-download"


onClick={exportCSV}


/>



</div>


</div>










{

isMobile ?


(


<SavedLeadCard


leads={filteredLeads}


editLead={editLead}


deleteLead={deleteLead}


openWhatsApp={openWhatsApp}


/>


)


:


(


<div

className="
bg-white
rounded-2xl
shadow-lg
p-5
"

>


<DataTable


ref={dt}


value={filteredLeads}


paginator


rows={10}


rowsPerPageOptions={[10,20,50]}


stripedRows


showGridlines


globalFilter={globalFilter}


emptyMessage="No Saved Leads Found"


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

header="Follow Up"

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


</div>


)

}













{/* Update Popup */}



<Dialog


header="Update Lead"


visible={visible}


modal


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
gap-5
"

>





<div>


<label className="font-semibold">

Status

</label>



<Dropdown


value={status}


options={statuses}


onChange={(e)=>
setStatus(e.value)
}


className="w-full mt-2"


/>



</div>









<div>


<label className="font-semibold">

Follow Up Date

</label>



<Calendar


value={followup}


onChange={(e)=>
setFollowup(e.value)
}


showIcon


dateFormat="dd/mm/yy"


className="w-full mt-2"


/>



</div>









<div>


<label className="font-semibold">

Notes

</label>




<InputTextarea


rows={5}


value={notes}


onChange={(e)=>
setNotes(e.target.value)
}


placeholder="Enter Notes"


className="w-full mt-2"


/>



</div>









<Button


label="Save Changes"


icon="pi pi-check"


onClick={updateLead}


className="
bg-blue-600
"


/>





</div>



</Dialog>





</div>


);


}


export default SavedLeads;