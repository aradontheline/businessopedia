
export interface User {
    email:string;
    pass:string;
    phone?:string;
    username?:string;
  }
export interface Business{
    title:string;
    bio:string;
    pictures:string[];
    contact?:{
        phone?:string;
        mobile?:string;
        address?:{
            country:string;
            province:string;
            city:string;
            street1:string;
            street2:string;
            building:string;
            unit:string;
        };
        location?:{
            lat:number;
            lng:number;
        }
    }
}

export interface Message{
    message:string,
    sender:object,
    receiver:object,
    unread:boolean
}

export interface Chat{
    member:string
}

let businessInit = {
    title:'',
    bio:'',
    pictures:[],
    contact:{
        phone:'',
        mobile:'',
        address:{
            country:'',
            province:'',
            city:'',
            street1:'',
            street2:'',
            building:'',
            unit:''
        },
      location:{
        lat:35.7,
        lng:51.4
      }
    }
  };

let chatInit = {
    message:'hello',
    unread:false
}

  export {businessInit,chatInit};
