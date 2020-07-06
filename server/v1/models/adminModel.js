import UserModel from './userModel';

class Admin extends UserModel {
  constructor(firstName, lastName, email, password) {
    super(firstName, lastName, email, password);
    this.isAdmin = true;
  }
}

export default Admin;
