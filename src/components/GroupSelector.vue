<template>
  <div id="kanji-group-selector">
    <b-container>
      <b-nav>
        <b-nav-form>
          <div>
            Select kanji group:
            <b-dropdown id="kanji-group-selector-dropdown" :text="selectedGroup.name + ' (' + selectedGroup.count + ')'" class="m-md-2">
              <b-dropdown-item-button v-for="group in groups" :key="group.label" :active="group.label === selectedGroup.label" @click="selectGroup(group)">
                <div>{{group.name}} <b-badge class="float-right" variant="info">{{group.models.length}}</b-badge></div>
              </b-dropdown-item-button>
            </b-dropdown>
          </div>
        </b-nav-form>
        <b-nav-form @submit.stop.prevent="createGroup">
          <b-form-input aria-label="Input" class="mr-1" v-model="newGroupName" placeholder="New group"></b-form-input>
          <b-button type="submit" variant="info" :disabled="!newGroupName">Create group</b-button>
          <b-button type="submit" variant="danger"  v-if="selectedGroup.custom" @click.prevent="deleteCustomGroup()" style="margin-left: 4px">Delete group</b-button>
        </b-nav-form>
        <b-nav-form style="flex-grow:1"></b-nav-form>
        <b-nav-form v-if="selectedKanjiCount && customGroups.length" @submit.stop.prevent="addKanjiToGroup(groupToAdd)" style="flex-grow:1;">
          <b-button type="submit" variant="info">Add kanji to group:</b-button>
          <b-dropdown right :text="groupToAdd.name" variant="primary" class="m-2">
            <b-dropdown-item v-for="group in customGroups" :key="group.label" @click.prevent="groupToAdd=group">
              {{group.name}}
            </b-dropdown-item>
          </b-dropdown>
        </b-nav-form>
      </b-nav>
    </b-container>
  </div>
</template>

<script>
  export default {
    props: {
      groups: Array,
      selectedGroup: Object,
      customGroups: Array,
      selectGroup: Function,
      createCustomGroup: Function,
      deleteCustomGroup: Function,
      addKanjiToGroup: Function,
      selectedKanjiCount: Number
    },
    data() {
      return {
        newGroupName: '',
        groupToAdd: null
      }
    },
    created() {
      this.setGroupToAdd();
    },
    watch: {
      customGroups() {
        this.setGroupToAdd();
      }
    },
    methods: {
      createGroup() {
        if (this.newGroupName) {
          this.createCustomGroup(this.newGroupName);
          this.newGroupName = '';
        }
      },
      setGroupToAdd() {
        if (this.customGroups.length) {
          this.groupToAdd = this.customGroups[0];
        }
      }
    }
  }
</script>

<style media="screen">
#kanji-group-selector {
  position:absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 54px;
  border-bottom: 1px solid #eee;
}

#kanji-group-selector-dropdown {
  min-width: 130px;

}
</style>
