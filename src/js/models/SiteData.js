import { observable, action } from "mobx";

export default class SiteData {
    @observable openAssociatesPopup = false;
    @observable openLeaderBoardPopup = false;
    @observable selectedAssociates = [];
    @observable isLoading = false;
    @observable toast = {
        show: false,
        text: null
    };

    @action
    showAssociatePopup(flag) {
        this.openAssociatesPopup = flag;
    }

    @action
    showLeaderBoardPopup(flag) {
        this.openLeaderBoardPopup = flag;
    }

    @action
    setAssociates(associates) {
        this.selectedAssociates = associates;
    }

    @action
    setLoading(newVal) {
        this.isLoading = newVal;
    }

    setToast(txt) {
        this.toast = {
            show: true,
            text: txt
        };
    }

    resetToast() {
        this.toast.show = false;
    }
}
