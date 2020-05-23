<template>
  <div id="kanji-group-selector">
    <b-container>
      <b-nav>
        <b-nav-form>
          <div>
            Select kanji group:
            <b-dropdown id="kanji-group-selector-dropdown" :text="text" class="m-md-2">
              <b-dropdown-item-button v-for="group in groups" :key="group.label" :active="group.label === selectedGroup.label" @click="selectGroup(group)">
                <div>{{group.name}} <b-badge class="float-right" variant="info">{{group.models.length}}</b-badge></div>
              </b-dropdown-item-button>
            </b-dropdown>
          </div>
        </b-nav-form>
        <b-nav-form>
          <slot></slot>
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
      selectGroup: Function
    },

    computed: {
      text() {
        return `${this.selectedGroup.name} (${this.selectedGroup.models.length})`;
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
