import Parse from 'parse';

export const addTweet = async (message, attachment, tags) => {
    try {
        const Tweet = new Parse.Object('Tweet');
        Tweet.set('Poster', 'John');
        Tweet.set('Message', message);
        Tweet.set('Attachment', attachment);
        Tweet.set('tags', tags);
        Tweet.set('Comments', '');
        Tweet.set('Likes', '0');
        await Tweet.save();
        console.log('Tweet saved');
    } catch (error) {
        console.log('Error saving new tweet: ', error);
    }
};

export const fetchTweetById = async (id) => {
    try {
        const query = new Parse.Query('Tweet');
        const tweet = await query.get(id);
        console.log('Poster: ', tweet.get('Poster'));
        console.log('Message: ', tweet.get('Message'));
        console.log('Likes: ', tweet.get('Likes'));
        return tweet;
    } catch (error) {
        console.log('Error fetching tweet: ', error);
    }
};

export const fetchAllTweets = async () => {
    try {
        const query = new Parse.Query('Tweet');
        const results = await query.find();
        return results;
    } catch (error) {
        console.log('Error fetching tweets: ', error);
    }
}

export const fetchTweetsByPoster = async (poster) => {
        try {
            const query = new Parse.Query('Tweet');
            query.equalTo('Poster', poster);
            const results = await query.find();
            return results;
        } catch (error) {
            console.log('Error fetching tweets by poster: ', error);
        }
    };

export const deleteTweetById = async (id) => {
    try {
        const query = new Parse.Query('Tweet');
        const tweet = await query.get(id);
        await tweet.destroy();
        console.log('Tweet deleted');
    } catch (error) {
        console.log('Error deleting tweet: ', error);
    }
};