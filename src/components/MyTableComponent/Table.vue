<template>
  <div :class="className">
    <table>
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="index">
            {{ column.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(dataRow, dataIndex) in dataSource" :key="dataIndex" @click="handleRowClick({...dataRow, RowIndex: dataIndex})">
          <td v-for="(column, columnIndex) in columns" :key="columnIndex">
            <div v-if="column.template">
              <slot :rowData="{...dataRow, prop: column, ColumnIndex: columnIndex, RowIndex: dataIndex} " :name="column.template" />
            </div>
            <div v-else-if="column.input">
              <el-input v-model="dataRow[column.field]" type="text" />
            </div>
            <div v-else>
              <div v-if="column.unShorten">
                {{ dataRow[column.field] }}
              </div>
              <div v-else>
                {{ shortenString(dataRow[column.field]) }}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    className: {
      type: String,
      default: ''
    },
    columns: {
      type: Array,
      default: () => []
    },
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleRowClick(rowData) {
      this.$emit('row-click', rowData)
    },
    shortenString(str) {
      if (typeof str === 'string') {
        if (str.length <= 16) {
          return str
        } else {
          const firstThree = str.slice(0, 12)
          const lastThree = str.slice(-3)
          return `${firstThree}...${lastThree}`
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$--color-text: black;
$--color-text-white: white;
$--color-border-light: #303033;
$--space-3: 24px;
.table-container-height {
  margin: 10px 24px;
  border: 1px solid rgb(71, 71, 75);
  background: linear-gradient(-90deg,rgba(16, 255, 132, 0.6),rgba(95, 221, 255, 0.6));
  min-height: 60vh;
  border-radius: 10px;
  table {
    display: table;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0px;
    thead {
      display: table-header-group;
      tr {
        color: $--color-text;
        display: table-row;
        vertical-align: middle;
        outline: 0px;
        th {
          border-bottom: 1px solid rgb(48, 48, 51);
          display: table-cell;
          text-align: left;
          padding: 16px;
          font-size: 16px;
          line-height: 22px;
          font-weight: 600;
          text-transform: uppercase;
          /* color: rgb(161, 163, 167); */
        }
      }
    }
    tbody {
      display: table-row-group;
      tr {
        transition: background-color 0.2s ease 0s;
        display: table-row;
        vertical-align: middle;
        outline: 0px;
        td {
          padding: 8px 0px;
          font-size: 16px;
          line-height: 22px;
          font-weight: 400;
          display: table-cell;
          border-bottom: 1px solid rgb(81, 81, 81);
          padding: 16px;
          color: $--color-text;
          text-align: left;
        }
      }
      tr:nth-child(odd) {
        background-color: rgba(102, 102, 102, 0.2);
      }
    }
  }
  .action {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
  }
}

.table-container {
  margin: 10px 24px;
  border: 1px solid rgb(71, 71, 75);
  border-radius: 10px;
  table {
    display: table;
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0px;
    thead {
      display: table-header-group;
      tr {
        color: $--color-text-white;
        display: table-row;
        vertical-align: middle;
        outline: 0px;
        th {
          border-bottom: 1px solid rgb(48, 48, 51);
          display: table-cell;
          text-align: left;
          padding: 16px;
          font-size: 16px;
          line-height: 22px;
          font-weight: 600;
          text-transform: uppercase;
          /* color: rgb(161, 163, 167); */
        }
      }
    }
    tbody {
      display: table-row-group;
      tr {
        transition: background-color 0.2s ease 0s;
        display: table-row;
        vertical-align: middle;
        outline: 0px;
        td {
          padding: 8px 0px;
          font-size: 16px;
          line-height: 22px;
          font-weight: 400;
          display: table-cell;
          border-bottom: 1px solid rgb(81, 81, 81);
          padding: 16px;
          color: $--color-text;
          text-align: left;
        }
      }
      tr:nth-child(odd) {
        background-color: rgba(102, 102, 102, 0.2);
      }
    }
  }
  .action {
    display: flex;
    justify-content: flex-start;
    gap: 10px;
  }
}
</style>
