export class UsersDTO{
    constructor(user){
        this.first_name=user.first_name.toUpperCase()
        this.last_name=user.last_name?user.last_name.toUpperCase():null
        this.fullName=user.last_name?`${this.first_name} ${this.last_name}`:this.first_name
        this.email=user.email
        this.rol=user.rol
    }
}