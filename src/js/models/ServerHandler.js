import { observable, action } from "mobx";
import {config} from '../../config';
import axios from 'axios';
import Cookies from 'universal-cookie';
import moment from 'moment';

const mockResults = true;
const mockData = {
    envs: [{
        _id: 1,
        name: 'FrozenLake'
    }],
    games: [{
        _id: 1,
        name: 'FrozenLake2019',
        env_id: 1
    },{
        _id: 2,
        name: 'FrozenLake2020',
        env_id: 1
    }],
    users: [
        {
            id: 1,
            name: 'Sap',
            email: 'sap@afeka.com'
        },
        {
            id: 2,
            name: 'Dan',
            email: 'dan@afeka.com'
        },
        {
            id: 3,
            name: 'Yoni',
            email: 'yoni@afeka.com'
        },
        {
            id: 4,
            name: 'Moti',
            email: 'mt@afeka.com'
        },
        {
            id: 5,
            name: 'Bar',
            email: 'b@afeka.com'
        }
    ],
    current_user: {
        id: 1,
        name: 'Sap'
    },
    user_assignments: [
        {
            game_name: 'FrozenLake2019',
            group_ids: [1, 2],
            submission_date: '20/04/19 19:01:56',
            scores: { simpleAvg: 0.93 }
        }
    ],
    game_assignments: [
        {
            game_id: 1,
            game_name: 'FrozenLake2019',
            group_ids: [1, 2],
            submission_date: '20/04/19 19:01:56',
            scores: { simpleAvg: 0.93 }
        },
        {
            game_id: 1,
            game_name: 'FrozenLake2019',
            group_ids: [3, 4],
            submission_date: '21/04/19 18:53:12',
            scores: { simpleAvg: 0.89 }
        },
        {
            game_id: 2,
            game_name: 'FrozenLake2020',
            group_ids: [2, 5],
            submission_date: '12/03/20 19:13:46',
            scores: { simpleAvg: 0.91 }
        }
    ]
};

export default class ServerHandler {
    cookies = new Cookies();
    @observable user = null;
    @observable envs = [];
    @observable games = [];
    @observable users = [];
    @observable assignment_submissions = null;
    @observable all_assignment_submissions = null;

    @action
    async submitAssignment(formData, headers) {
        if(mockResults) {
            let formObj = {};
            formData.forEach(function(value, key){
                formObj[key] = value;
            });
            formObj.group_ids = formObj.group_ids.split(',').map(id => Number(id));
            formObj.game_name = mockData.games.filter(g => g._id == formObj.game_id)[0].name;
            delete formObj.agent;
            formObj.scores = { simpleAvg: Math.round((Math.random() * (1 - 0.7) + 0.7) * 100) / 100 };
            formObj.submission_date = moment().format('DD/MM/YY HH:mm:ss');
            mockData.user_assignments.push(formObj);
            await new Promise((resolve, reject) => setTimeout(resolve, 3000));
            return
        }

        await axios.put(config.url + config.routes.submit_assignment, formData, headers);
    }

    @action
    async addGame(formData) {
        let formCopy = Object.assign({}, formData);
        formCopy.due_date = formCopy.due_date.format('DD/MM/YYYY');

        if(mockResults) {
            mockData.games.push(formCopy);
            console.log(formCopy)
            return;
        }

        let formDataNew = new FormData();

        for(let key in formCopy) {
            formDataNew.append(key, formCopy[key]);
        }

       await axios.put(config.url + config.routes.add_game, formDataNew);
    }

    @action
    setUserFromCookie() {
        this.user = this.cookies.get('user');
    }

    @action
    clearUser() {
        this.cookies.remove('user');
        this.user = null;
    }

    @action
    async approveUserLogin(formData) {
        if(mockResults) {
            if(formData.email === 'admin')
                formData.name = formData.email;

            Object.assign(mockData.current_user, formData);
            this.user = mockData.current_user;
        }
        else {
            //await axios.post(config.url + config.routes.get_user, formData);
        }

        let d = new Date();
        d.setTime(d.getTime() + (config.user_cookie_expiration));
        this.cookies.set('user', this.user, { path: '/', expires: d  });
    }

    @action
    async signup(formData) {
        //await axios.post(config.url + config.routes.signup, formData);
    }

    @action
    async getGames() {
        if(mockResults) {
            this.games = mockData.games;
            return;
        }

        this.games = (await axios.get(config.url + config.routes.get_games, {crossDomain: true})).data;
    }

    @action
    async getEnvs() {
        if(mockResults) {
            this.envs = mockData.envs;
            return;
        }

        this.envs = (await axios.get(config.url + config.routes.get_envs, {crossDomain: true})).data;
    }

    @action
    async getUsers() {
        if(mockResults) {
            this.users = mockData.users;
            return;
        }

        // this.users = await axios.get(config.url + config.routes.get_users, {crossDomain: true});
    }

    @action
    async getUserAssignments() {
        let assignments;
        if(mockResults) {
            assignments = mockData.user_assignments;
        }
        else
            assignments =
                (await axios.get(config.url + config.routes.get_user_assignments(this.user.id), {crossDomain: true})).data

        assignments = assignments.map(a => {
            a.group_names = a.group_ids.map(id =>
                this.users.filter(u=> u.id === id)[0].name);
            return a;
        });

        this.assignment_submissions = assignments;
    }

    @action
    async getAdminAllAssignments(game_id) {
        let assignments;
        if(mockResults) {
            assignments = mockData.game_assignments.filter(o => o.game_id === game_id);
        }
        else
            assignments = (await axios.get(config.url + config.routes.get_game_assignments(game_id),
                {crossDomain: true})).data.submissions;

        assignments = assignments.map(a => {
            a.group_names = a.group_ids.map(id =>
                this.users.filter(u=> u.id === id)[0].name);
            return a;
        });

        this.all_assignment_submissions = assignments;
    }
}
