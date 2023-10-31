const development = {
    name:'development',
    asset_path:'./assets',
    session_cookie_key:'blahsomething',
    db:'Facebook',
    google_client_id: 'cee1ba1361c184767359',    // GitHub OAuth client ID
    google_client_secret: '6042933e8cc766a729ec071e63df4a218e50bb1c',    // GitHub OAuth client secret
    google_call_back_url: 'http://localhost:8000/api/v1/users/auth/github/callback',
}

const production = {
    name:'production',
    asset_path:process.env.FACEBOOK_ASSET_PATH,
    session_cookie_key:'blahsomething',
    db:'Facebook',
    google_client_id: 'cee1ba1361c184767359',    // GitHub OAuth client ID
    google_client_secret: '6042933e8cc766a729ec071e63df4a218e50bb1c',    // GitHub OAuth client secret
    google_call_back_url: 'http://facebook.com/api/v1/users/auth/github/callback',
}

module.exports = development