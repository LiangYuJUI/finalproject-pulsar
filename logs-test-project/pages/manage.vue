<template>
    <div @click="userWindowShow=false" class="bg-slate-50 flex-grow shadow-lg">
        <div class="flex flex-col items-center">
            <h1 class="text-6xl text-gray-600 py-6 font-semibold">使用者管理</h1>
            <div class="rounded-t-xl">
                <table class="rounded-t-xl text-left" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';">
                    <thead>
                        <tr class="bg-gray-200/50 font-semibold border-b-2 ">
                            <td class="p-4">姓名</td>
                            <td class="p-4">email</td>
                            <td class="p-4">單位</td>
                            <td class="p-4">職稱</td>
                            <td class="p-4">NeoPower</td>
                            <td class="p-4">Head</td>
                            <td class="p-4">Manager</td>
                            <td class="p-4">Viewer</td>
                            <td class="p-4">操作</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="user, idx in users.data" :key="idx" class="border-b hover:bg-gray-100 transition">
                            <td class="p-4"><p class="font-semibold text-blue-500 cursor-pointer hover:text-blue-400 transition">{{ user.name }}</p></td>
                            <td class="p-4"> {{ user.email }} </td>
                            <td class="p-4"> {{ user.department }} </td>
                            <td class="p-4"> {{ user.jobtitle }} </td>
                            <td class="p-4"> {{ user.roles.includes("neopower") }} </td>
                            <td class="p-4"> {{ user.roles.includes("head") }} </td>
                            <td class="p-4"> {{ user.roles.includes("manager") }} </td>
                            <td class="p-4"> {{ user.roles.includes("viewer") }} </td>
                            <td class="p-4">
                                <div @click="handleUpdateClick(idx)" @click.stop="() => { }" class="ant-tag ant-tag-update">編輯</div>
                                <div @click="handleDeleteClick(idx)" @click.stop="() => { }" class="ant-tag ant-tag-delete">刪除</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div @click.stop="() => { }" @click="handleAddUserClick"  class="mt-6 p-1 text-center rounded-md hover:opacity-80 w-full bg-green-200/50 cursor-pointer active:bg-green-300/50 select-none">
                    新增使用者
                </div>
            </div>
            
            <div v-show="userWindowShow" @click.stop="() => { }" class="fixed w-1/2 my-6 bg-gray-700/80 mx-auto text-center text-white shadow-lg">
                <h1 class="p-2 shadow">{{ editMode==true ? "編輯使用者" : "新增使用者" }}</h1>
                <div class="flex flex-row justify-items-stretch w-2/3 my-6 bg-white/10 mx-auto rounded-sm">
                    <p class="flex-1">姓名<a class="text-red-500">*</a></p>
                    <input v-model="name" type="input" class="bg-gray-700/80 w-5/6 outline-0 text-center radius-1" required>
                </div>
                <div class="flex flex-row justify-items-stretch w-2/3 my-6 bg-white/10 mx-auto rounded-sm">
                    <p class="flex-1">email<a class="text-red-500">*</a></p>
                    <input v-model="email" type="input" class="bg-gray-700/80 w-5/6 outline-0 text-center radius-1" required>
                </div>
                <div class="flex flex-row justify-items-stretch w-2/3 my-6 bg-white/10 mx-auto rounded-sm">
                    <p class="flex-1">密碼<a v-show="!editMode" class="text-red-500">*</a></p>
                    <input v-model="password" type="input" class="bg-gray-700/80 w-5/6 outline-0 text-center radius-1" required>
                </div>
                <div class="flex flex-row justify-items-stretch w-2/3 my-6 bg-white/10 mx-auto rounded-sm">
                    <p class="flex-1">單位<a class="text-red-500">*</a></p>
                    <input v-model="department" type="input" class="bg-gray-700/80 w-5/6 outline-0 text-center radius-1" required>
                </div>
                <div class="flex flex-row justify-items-stretch w-2/3 my-6 bg-white/10 mx-auto rounded-sm">
                    <p class="flex-1">職稱<a class="text-red-500">*</a></p>
                    <input v-model="jobtitle" type="input" class="bg-gray-700/80 w-5/6 outline-0 text-center radius-1" required>
                </div>
                <div class="flex flex-row justify-items-stretch w-2/3 my-6 bg-white/10 mx-auto rounded-sm">
                    <p class="flex-1">權限<a class="text-red-500">*</a></p>
                    <div class="w-5/6 flex flex-row justify-center">
                        <div class="mx-2">
                            <input type="checkbox" id="neopower" value="neopower" v-model="roles" class="bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                            <label for="neopower">Neopower</label>
                        </div>
                        <div class="mx-2">
                            <input type="checkbox" id="head" value="head" v-model="roles" />
                            <label for="head">Head</label>
                        </div>
                        <div class="mx-2">
                            <input type="checkbox" id="manager" value="manager" v-model="roles" />
                            <label for="manager">Manager</label>
                        </div>
                        <div class="mx-2">
                            <input type="checkbox" id="viewer" value="viewer" v-model="roles" />
                            <label for="viewer">Viewer</label>
                        </div>
                    </div>
                </div>
                <div>
                    {{ roles }}
                </div>
                <div class="mb-6">
                    <div @click="handleSubmit" class="w-20 bg-white text-black mx-auto rounded inline-block ant-tag ant-tag-update">
                        送出
                    </div>
                    <div @click="handleReset" class="w-20 bg-red-300 text-black mx-auto rounded inline-block ant-tag ant-tag-delete">
                        清除
                    </div>
                </div>
            </div>
            <div>
                <p class="mt-4 text-2xl text-green-600/50 text-center font-handwriting italic">Smart charging is not just about plugging in, it's about plugging into a smarter and more sustainable future.</p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { useTokenStore } from '../stores/token'


definePageMeta({
    middleware: defineNuxtRouteMiddleware( async (to, from) => {
        const tokenStore = useTokenStore()
        const result = await tokenStore.authRole("neopower");
        // console.log(result)
        if (process.client) {
            if (result.error.value){
                if(to.path !== `/login`){
                    alert("Permission denied");
                    return navigateTo('/');
                }
            }
        }
    })
})

const userWindowShow = ref(false)
const editMode = ref(false)
const users = ref([])
const name = ref("")
const email = ref("")
const password = ref("")
const department = ref("")
const jobtitle = ref("")
const roles = ref([])



// let users = reactive([])
const headers = useRequestHeaders(['cookie']);
users.value = await $fetch('/api/user', { headers });

const handleSubmit = async () => {
    console.log(name.value, email.value, password.value, department.value, jobtitle.value, roles.value);
    if( ! ( name.value && email.value && department.value && jobtitle.value && roles.value.length ) ) {
        alert("缺少必填欄位")
        return ;
    }
    try{
        let result = "";
        const requestUrl = editMode.value ? `/api/user/update` : `/api/user/register`;
        result = await $fetch(requestUrl, {
            method: `POST`,
            body: {
                name: name.value,
                email: email.value,
                password: password.value,
                department: department.value,
                jobtitle: jobtitle.value,
                roles: roles.value
            }
        });
        if(result.success){
            users.value = await $fetch('/api/user');
            alert(result.message);
            handleReset();
            userWindowShow.value = false;
            return ;
        }
        else{
            alert(result.message);
        }
    }
    catch(error){
        console.log(error);
        alert(error.message);
        return;
    }
    

}
const handleReset = () => {
    name.value = "";
    email.value = "";
    password.value = "";
    department.value = "";
    jobtitle.value = "";
    roles.value = [];
    return ;
}
const handleAddUserClick = async (idx) => {
    userWindowShow.value = true;
    editMode.value = false;
    name.value = "";
    email.value = "";
    password.value = "";
    department.value = "";
    jobtitle.value = "";
    roles.value = [];
    return ; 
}
const handleUpdateClick = async (idx) => {
    console.log("handleUpdateClick")
    userWindowShow.value = true;
    editMode.value = true;
    try {
        name.value = users.value.data[idx].name;
        email.value = users.value.data[idx].email;
        department.value = users.value.data[idx].department;
        jobtitle.value = users.value.data[idx].jobtitle;
        roles.value = users.value.data[idx].roles;

    }
    catch(error) {
        alert(error.message);
    }
}
const handleDeleteClick = async (idx) => {
    try{
        const { _id } = users.value.data[idx];
        const result = await $fetch(`/api/user/${_id}`, {
            method: `DELETE`
        });
        alert( _id, result.message);
        if( result.success ){
            users.value = await $fetch('/api/user');
        }
    }
    catch(error){
        alert(error.message);
    }
}

</script>
<style scope>
.ant-tag {
    border-radius: 4px;
    cursor: pointer;
    transition: all .15s ease-out;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    color: rgba(0, 0, 0, 0.88);
    font-size: 12px;
    line-height: 20px;
    list-style: none;
    font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji';
    display: inline-block;
    height: auto;
    margin-inline-end: 8px;
    padding-inline: 7px;
    white-space: nowrap;
    background: rgba(0, 0, 0, 0.02);
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    opacity: 1;
    transition: all 0.2s;
}
.ant-tag:hover {
    opacity:0.8;
}
.ant-tag-update {
    background-color: rgb(16, 142, 233);
    color: #FFFFFF;
}
.ant-tag-delete {
    background-color: rgb(255, 85, 0);
    color: #FFFFFF;
}
</style>