<template>
  <div class="body-container">
    <div class="left-side">
      <div class="input-file-div">
        <input
          type="file"
          ref="file"
          @change="selectImage($event); $refs.file.value=''"
          style="display: none"
          accept="image/png, image/jpeg"
        />
        <button class="btn-choose-file" @click="$refs.file.click()">Choose Image</button>
      </div>
      <div
        class="image-div"
        @mousedown="handleMouseDown($event)"
        @mousemove="handleMouseMove($event)"
        ref="imageDiv"
        :style="[imageSrc == null? {'background-color':'grey'}:{}]"
      >
        <img
          v-if="imageSrc != null"
          id="image-viewer"
          ref="imageViewer"
          :src="imageSrc"
          class="image-viewer"
          alt="Logo Image"
          :style="{  height: displayHeight + 'px' }"
        />
        <div
          class="rect-div"
          v-for="(div, idx) in listDiv"
          :key="idx"
          :style="{ top: div.drawTop + 'px', 
          left: div.drawLeft + 'px', 
          width: div.drawWidth + 'px', 
          height: div.drawHeight + 'px' }"
        >{{div.id}}</div>
        <div
          class="drawing-div"
          v-if="drawingDiv != null"
          :style="{ top: drawingDiv.top + 'px', left: drawingDiv.left + 'px', width: drawingDiv.width + 'px', height: drawingDiv.height + 'px' }"
        ></div>
      </div>
    </div>
    <div class="right-side">
      <div class="row-id-container">
        <div class="row-container">
          <div class="row-id">No.</div>
        </div>

        <draggable v-model="listDiv" @start="drag=true" @end="drag=false; handleOnDragEnd($event)">
          <div v-for="element in listDiv" :key="element.id" class="row-container">
            <div class="row-id">{{element.id}}</div>
          </div>
        </draggable>
      </div>
      <div class="table-container">
        <table>
          <thead class="table-header">
            <td>Left</td>
            <td>Top</td>
            <td>Width</td>
            <td>Height</td>
            <td></td>
          </thead>
          <tbody>
            <tr v-for="element in listDiv" :key="element.id" class="table-row">
              <td>{{Math.round(element.left)}}</td>
              <td>{{Math.round(element.top)}}</td>
              <td>{{Math.round(element.width)}}</td>
              <td>{{Math.round(element.height)}}</td>
              <td>
                <button class="delete-btn" @click="deleteItem(element.id)">
                  <i class="fa fa-trash" aria-hidden="true"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  name: "RegionCreation",
  components: {
    draggable
  },
  props: {},
  data: function() {
    return {
      loading: false,
      listDiv: [],
      drawingDiv: null,
      startPoint: null,
      imageSrc: null,
      ratioWidth: 1,
      ratioHeight: 1,
      displayWidth: 0,
      displayHeight: 0,
      imgWidth: 1,
      imgHeight: 1,
      resizeInfo: null
    };
  },
  methods: {
    handleMouseDown(event) {
      event.preventDefault();
      const pos = this.getPosition(event);
      if (this.displayHeight !== 0) {
        if (pos.y > this.displayHeight) {
          return;
        }
      }
      const resizePos = this.getResizePosition(pos);
      if (resizePos == null) {
        this.startPoint = { x: pos.x, y: pos.y };
      } else {
        this.resizeInfo = resizePos;
      }
    },
    handleMouseMove(event) {
      const pos = this.getPosition(event);
      if (this.displayHeight !== 0) {
        if (pos.y > this.displayHeight) {
          return;
        }
      }
      if (this.startPoint != null) {
        document.body.style.cursor = "crosshair";
        this.drawingDiv = {
          left: Math.min(this.startPoint.x, pos.x),
          top: Math.min(this.startPoint.y, pos.y),
          width: Math.abs(pos.x - this.startPoint.x),
          height: Math.abs(pos.y - this.startPoint.y)
        };
      } else if (this.resizeInfo != null) {
        this.handleResizeDiv(pos);
      } else {
        const resizePos = this.getResizePosition(pos);
        if (resizePos != null) {
          document.body.style.cursor = resizePos.position;
        } else {
          document.body.style.cursor = "context-menu";
        }
      }
    },
    handleMouseUp() {
      document.body.style.cursor = "context-menu";
      this.startPoint = null;
      this.resizeInfo = null;
      if (this.drawingDiv != null) {
        if (this.drawingDiv.width > 10 && this.drawingDiv.height > 10) {
          const newDiv = {};
          newDiv["id"] = this.listDiv.length + 1;
          newDiv["top"] = this.drawingDiv.top / this.ratioHeight;
          newDiv["left"] = this.drawingDiv.left / this.ratioWidth;
          newDiv["width"] = this.drawingDiv.width / this.ratioWidth;
          newDiv["height"] = this.drawingDiv.height / this.ratioHeight;
          newDiv["drawTop"] = this.drawingDiv.top;
          newDiv["drawLeft"] = this.drawingDiv.left;
          newDiv["drawWidth"] = this.drawingDiv.width;
          newDiv["drawHeight"] = this.drawingDiv.height;
          this.listDiv.push(newDiv);
        }
      }
      this.drawingDiv = null;
    },
    handleResizeDiv(pos) {
      const resizeDirection = this.resizeInfo.position;
      const resizeDiv = this.resizeInfo.div;
      if (resizeDirection === "w-resize") {
        const endPointDraw = resizeDiv.drawLeft + resizeDiv.drawWidth;
        if (pos.x + 5 >= endPointDraw) {
          document.body.style.cursor = "not-allowed";
        } else {
          document.body.style.cursor = resizeDirection;
          resizeDiv.drawLeft = pos.x;
          resizeDiv.drawWidth = endPointDraw - pos.x;
          const endPoint = resizeDiv.left + resizeDiv.width;
          resizeDiv.left = resizeDiv.drawLeft / this.ratioWidth;
          resizeDiv.width = endPoint - resizeDiv.left;
        }
      } else if (resizeDirection === "n-resize") {
        const endPointDraw = resizeDiv.drawTop + resizeDiv.drawHeight;
        if (pos.y + 5 >= endPointDraw) {
          document.body.style.cursor = "not-allowed";
        } else {
          document.body.style.cursor = resizeDirection;
          resizeDiv.drawTop = pos.y;
          resizeDiv.drawHeight = endPointDraw - pos.y;
          const endPoint = resizeDiv.top + resizeDiv.height;
          resizeDiv.top = resizeDiv.drawTop / this.ratioHeight;
          resizeDiv.height = endPoint - resizeDiv.top;
        }
      } else if (resizeDirection === "e-resize") {
        if (
          pos.x + 5 <= resizeDiv.drawLeft ||
          pos.x / this.ratioWidth <= resizeDiv.left
        ) {
          document.body.style.cursor = "not-allowed";
        } else {
          document.body.style.cursor = resizeDirection;
          resizeDiv.drawWidth = pos.x - resizeDiv.drawLeft;
          resizeDiv.width = pos.x / this.ratioWidth - resizeDiv.left;
        }
      } else {
        if (
          pos.y + 5 <= resizeDiv.drawTop ||
          pos.y / this.ratioHeight <= resizeDiv.top
        ) {
          document.body.style.cursor = "not-allowed";
        } else {
          document.body.style.cursor = resizeDirection;
          resizeDiv.drawHeight = pos.y - resizeDiv.drawTop;
          resizeDiv.height = pos.y / this.ratioHeight - resizeDiv.top;
        }
      }
    },
    handleWindowResize() {
      const currentWidth = this.$refs.imageDiv.getBoundingClientRect().width;
      if (currentWidth === this.displayWidth || this.displayHeight == null) {
        return;
      }
      const resizeRatio = currentWidth / this.displayWidth;
      this.displayHeight = resizeRatio * this.displayHeight;
      this.ratioWidth = currentWidth / this.imgWidth;
      this.ratioHeight = this.displayHeight / this.imgHeight;
      this.displayWidth = currentWidth;
      this.listDiv.forEach(div => {
        div.drawTop = this.calculateRealSizeVertical(div.top);
        div.drawLeft = this.calculateRealSizeHorizontal(div.left);
        div.drawWidth = this.calculateRealSizeHorizontal(div.width);
        div.drawHeight = this.calculateRealSizeVertical(div.height);
      });
    },
    getPosition(event) {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      return {
        x: event.x - this.$refs.imageDiv.offsetLeft,
        y: event.y - this.$refs.imageDiv.offsetTop + scrollTop
      };
    },
    getResizePosition(pos) {
      for (const div of this.listDiv) {
        if (
          this.checkPointInRect(pos, {
            x: div.drawLeft - 1,
            y: div.drawTop,
            w: 2,
            h: div.drawHeight
          })
        ) {
          return { div: div, position: "w-resize" };
        }
        if (
          this.checkPointInRect(pos, {
            x: div.drawLeft,
            y: div.drawTop - 1,
            w: div.drawWidth,
            h: 2
          })
        ) {
          return { div: div, position: "n-resize" };
        }
        if (
          this.checkPointInRect(pos, {
            x: div.drawLeft + div.drawWidth - 1,
            y: div.drawTop,
            w: 2,
            h: div.drawHeight - 2
          })
        ) {
          return { div: div, position: "e-resize" };
        }
        if (
          this.checkPointInRect(pos, {
            x: div.drawLeft,
            y: div.drawTop + div.drawHeight - 1,
            w: div.drawWidth - 2,
            h: 2
          })
        ) {
          return { div: div, position: "s-resize" };
        }
      }
      return null;
    },
    checkPointInRect(point, rect) {
      if (point.x < rect.x || point.x > rect.x + rect.w) {
        return false;
      }
      if (point.y < rect.y || point.y > rect.y + rect.h) {
        return false;
      }
      return true;
    },
    selectImage(event) {
      this.$store.dispatch("setLoading", true);
      this.$nextTick(this.selectImageAfterShowLoading(event));
    },
    selectImageAfterShowLoading(event) {
      const listFiles = event.target.files;
      if (listFiles.length === 0) {
        this.$store.dispatch("setLoading", false);
        return;
      }
      const fileSize = listFiles[0].size;
      if (fileSize === 0) {
        this.$store.dispatch(
          "setErrorMessage",
          "The input file is blank. Please select an image file"
        );
        this.$store.dispatch("setLoading", false);
        return;
      }
      if (fileSize > 100 * 1024 * 1024) {
        this.$store.dispatch(
          "setErrorMessage",
          "The size of input file is too big. Maximum file size is 100MB"
        );
        this.$store.dispatch("setLoading", false);
        return;
      }
      var reader = new FileReader();
      reader.onload = e => {
        const image = new Image();
        image.src = e.target.result;
        image.onload = () => {
          this.$store.dispatch("setLoading", false);
          this.$store.dispatch("setSizeModificationDialog", {
            show: true,
            width: image.width,
            height: image.height,
            callback: (width, height) => {
              this.listDiv = [];
              if (
                isNaN(width) ||
                isNaN(height) ||
                width === 0 ||
                height === 0
              ) {
                this.ratioHeight = 1;
                this.ratioWidth = 1;
                this.displayHeight = null;
                this.$store.dispatch(
                  "setErrorMessage",
                  "Invalid image file. Please select an image file"
                );
                return;
              }
              this.imgWidth = width;
              this.imgHeight = height;
              const displayWidth = this.$refs.imageDiv.getBoundingClientRect()
                .width;
              this.displayHeight = (height / width) * displayWidth;
              this.imageSrc = e.target.result;
              this.ratioWidth = displayWidth / width;
              this.ratioHeight = this.displayHeight / height;
              setTimeout(() => {
                this.displayWidth = this.$refs.imageDiv.getBoundingClientRect().width;
                this.ratioWidth = this.displayWidth / width;
                this.displayHeight = (height / width) * this.displayWidth;
                this.ratioWidth = this.displayWidth / width;
                this.ratioHeight = this.displayHeight / height;
              }, 500);
            }
          });
        };
        image.onerror = () => {
          this.$store.dispatch(
            "setErrorMessage",
            "Invalid image file. Please select an image file"
          );
          this.$store.dispatch("setLoading", false);
        };
      };
      reader.onerror = () => {
        this.$store.dispatch(
          "setErrorMessage",
          "Cannot read the file. Please select another file"
        );
        this.$store.dispatch("setLoading", false);
      };
      reader.readAsDataURL(listFiles[0]);
    },
    calculateRealSizeHorizontal(size) {
      return Math.round(size * this.ratioWidth);
    },
    calculateRealSizeVertical(size) {
      return Math.round(size * this.ratioHeight);
    },
    deleteItem(itemId) {
      this.listDiv = this.listDiv.filter(item => item.id !== itemId);
      this.listDiv.forEach(item => {
        if (item.id > itemId) {
          item.id = item.id - 1;
        }
      });
    },
    handleOnDragEnd(event) {
      const oldIndex = event.oldIndex;
      const newIndex = event.newIndex;
      if (oldIndex === newIndex) {
        return;
      }
      if (oldIndex < newIndex) {
        this.listDiv.forEach(item => {
          if (item.id < oldIndex + 1 || item.id > newIndex + 1) {
            return;
          }
          if (item.id === oldIndex + 1) {
            item.id = newIndex + 2;
          }
          item.id = item.id - 1;
        });
      } else {
        this.listDiv.forEach(item => {
          if (item.id > oldIndex + 1 || item.id < newIndex + 1) {
            return;
          }
          if (item.id === oldIndex + 1) {
            item.id = newIndex;
          }
          item.id = item.id + 1;
        });
      }
    }
  },
  created() {
    document.addEventListener("mouseup", this.handleMouseUp, false);
    window.addEventListener("resize", this.handleWindowResize);
  },
  beforeDestroy: function() {
    window.removeEventListener("resize", this.handleWindowResize);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.body-container {
  display: flex;
  min-height: calc(100vh - 128px);
  background-color: #f9f4cb;
}

.input-file-div {
  padding-bottom: 1em;
  text-align: center;
}

.left-side {
  width: 70%;
  padding: 1em;
}

.right-side {
  display: flex;
  width: 30%;
  padding: 1em;
  margin-top: 25px;
}

.image-div {
  position: relative;
  height: calc(100% - 84px);
}

.image-viewer {
  width: 100%;
}

.rect-div {
  position: absolute;
  border: solid 2px rgb(5, 23, 130);
  color: black;
  background-color: rgba(5, 23, 130, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.drawing-div {
  position: absolute;
  border: solid 2px rgb(0, 128, 0);
}

.image-viewer {
  width: 100%;
}

.btn-choose-file {
  background-color: #45a1de;
  border-color: transparent;
  color: #fff;
  border: 1px solid transparent;
  border-radius: 4px;
  padding: 0.5em;
  font-size: 20px;
  font-weight: 700;
}

.row-container {
  display: flex;
  cursor: context-menu;
  border: 1px solid rgba(0, 0, 0, 0.1);
  /* font-size: 1.5em; */
  height: 2em;
}

.row-id {
  height: 2em;
  padding: 2px;
  width: 2.5em;
  text-align: center;
  background-color: #0ad5da;
  font-weight: bold;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}

.row-top,
.row-left,
.row-width,
.row-height {
  flex-basis: 3em;
  flex-grow: 1;
  text-align: center;
}

.delete-btn {
  width: 2em;
  background-color: red;
  border: red;
  border-radius: 6px;
}

.delete-btn > i {
  color: white;
}

.delete-header {
  width: 2em;
}

.table-header {
  background-color: #d0cccc;
  font-weight: bold;
}

.table-container {
  /* font-size: 1.5em; */
  flex-grow: 1;
}

.table-header > td {
  border: 1px solid #ddd;
  height: 2em;
}

.table-row > td {
  border: 1px solid #ddd;
  height: 2em;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

.table-container > table {
  width: 100%;
  table-layout: fixed;
}

td {
  text-align: center;
}

@media screen and (max-width: 1350px) {
  .body-container {
    display: block !important;
    min-height: calc(100vh - 128px);
    background-color: #f9f4cb;
  }
  .left-side,
  .right-side {
    width: 100% !important;
  }

  .row-id {
    width: 5em;
  }
}

@media (max-width: 519.98px) {
  .body-container {
    min-height: calc(100vh - 168px) !important;
  }
}
</style>
