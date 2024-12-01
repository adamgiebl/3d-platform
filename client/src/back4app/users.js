import Parse from 'parse';

export const addUser = async (name, email, password) => {
    try {
        const User = new Parse.Object('User');
        User.set('name', name);
        User.set('email', email);
        User.set('password', password);
        await User.save();
        console.log('User saved!');
    } catch (error) {
        console.log('Error saving new user: ', error);
    }
};