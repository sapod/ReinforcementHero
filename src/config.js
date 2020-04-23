export const config = {
    url: "http://34.243.164.149:5000/api/",
    routes: {
        submit_assignment: 'submit',
        add_game: 'game',
        get_user: 'get_user',
        get_envs: 'env',
        get_games: 'game',
        get_users: 'get_users',
        signup: 'singup',
        get_user_assignments: (id) => `submit/${id}`,
        get_game_assignments: (id) => `game/${id}`,
    },
    user_cookie_expiration: 30*60*1000
};