import { useState } from "react";

import {
  FaUser,
  FaKey,
  FaBell,
  FaSave,
} from "react-icons/fa";


function Settings(){


const user =
JSON.parse(
localStorage.getItem("user")
);



const [status,setStatus]=useState("New");

const [reminder,setReminder]=useState(true);

const [apiKey,setApiKey]=useState("");



const saveSettings=()=>{

alert("Settings Saved Successfully ✅");

};



return (

<div>


<h1 className="
text-2xl
font-bold
mb-6
">
Settings
</h1>




{/* Profile */}

<div className="
bg-white
rounded-2xl
shadow
p-6
mb-6
">


<h2 className="
text-xl
font-bold
flex
items-center
gap-2
mb-5
">

<FaUser/>

Profile

</h2>


<div className="space-y-3">


<p>
<b>Name :</b> {user?.name}
</p>


<p>
<b>Email :</b> {user?.email}
</p>


<p>
<b>Role :</b> {user?.role}
</p>


</div>


</div>







{/* CRM Settings */}


<div className="
bg-white
rounded-2xl
shadow
p-6
">


<h2 className="
text-xl
font-bold
mb-5
">
CRM Settings
</h2>



<label className="block mb-2">
Default Lead Status
</label>


<select

value={status}

onChange={
e=>setStatus(e.target.value)
}

className="
border
rounded-lg
px-4
py-2
w-full
mb-5
"
>


<option>
New
</option>

<option>
Contacted
</option>

<option>
Qualified
</option>

<option>
Proposal
</option>

<option>
Won
</option>

<option>
Lost
</option>


</select>





<label className="
flex
items-center
gap-3
mb-6
">


<input

type="checkbox"

checked={reminder}

onChange={
e=>setReminder(e.target.checked)
}

/>


<FaBell/>

Followup Reminder


</label>







<label>
Google API Key
</label>


<div className="
flex
items-center
gap-2
mt-2
">


<FaKey/>


<input

type="password"

value={apiKey}

onChange={
e=>setApiKey(e.target.value)
}

placeholder="Enter API Key"

className="
border
rounded-lg
px-4
py-2
flex-1
"

/>


</div>





<button

onClick={saveSettings}

className="
mt-6
bg-blue-600
hover:bg-blue-700
text-white
px-5
py-3
rounded-lg
flex
items-center
gap-2
"

>


<FaSave/>

Save Settings


</button>



</div>





</div>

);


}


export default Settings;