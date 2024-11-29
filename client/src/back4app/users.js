import Parse from 'parse';

export const addUser = async (name, email, bio) => {
    try {
        const User = new Parse.Object('User');
        User.set('Name', name);
        User.set('Email', email);
        User.set('Bio', bio);
        await User.save();
        console.log('User saved');
    } catch (error) {
        console.log('Error saving new user: ', error);
    }
}