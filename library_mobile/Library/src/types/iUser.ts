export interface iUser {
    _id?: string;
    name: string;
    gender:eGender;
    majors: any;
    email: string;
    password: string;
    role: string;
    active: boolean;
    code: string;
    studnetYear: number;
    accessToken?: string;
    dob:Date,
    image?: string;
}

export interface iUserReview {
    _id: string;
    name?: string;
    image?: string;
}

// export interface iMajor {
//     _id: string;
//     name: string | undefined;
// }

export enum eGender {
    nam = 'Male',
    nu = 'Female',
}
