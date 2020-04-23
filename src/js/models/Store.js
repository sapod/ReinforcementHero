import { observable } from "mobx";
import ServerHandler from './ServerHandler';
import SiteData from './SiteData';

export default class Store {
    @observable serverHandler = new ServerHandler();
    @observable siteData = new SiteData();
}
