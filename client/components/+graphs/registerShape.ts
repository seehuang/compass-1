import G6 from "@antv/g6";

G6.registerEdge("hvh", {
    draw(cfg, group) {
        return this.drawShape(cfg, group);
    },
    drawShape(cfg: any, group) {
        const startPoint = cfg.startPoint;
        const endPoint = cfg.endPoint;
        console.log(startPoint);
        console.log(endPoint);
        const shape = group.addShape("path", {
            attrs: {
                stroke: "#959DA5",
                lineWidth: 3,
                path: [
                    ["M", startPoint.x, startPoint.y],
                    ["L", endPoint.x / 3 + (2 / 3) * startPoint.x - 10, startPoint.y],
                    ["L", endPoint.x / 3 + (2 / 3) * startPoint.x - 10, endPoint.y],
                    ["L", endPoint.x - 10, endPoint.y],
                ],
            },
        });

        return shape;
    },
});



G6.registerNode(
    "card-node",
    {
        drawShape: function drawShape(cfg: any, group: any) {
            const color = cfg.error ? "#F4664A" : "#30BF78";
            const r = 5;
            const shape = group.addShape("rect", {
                attrs: {
                    x: 2,
                    y: 2,
                    width: 180,
                    height: 41,
                    lineWidth: 2,
                    radius: r,
                    fill: "#fff",
                },
                name: "main-box",
                draggable: true,
            });

            group.addShape("rect", {
                attrs: {
                    x: 0,
                    y: 0,
                    width: 179,
                    height: 40,
                },
                draggable: true,
            });

            // 标题
            group.addShape("text", {
                attrs: {
                    y: 20,
                    x: 5,
                    height: 16,
                    width: 16,
                    text: cfg.taskName,
                    style: {
                        fontWeight: 900,
                    },
                    fill: "black",
                },
                name: "title",
            });

            group.addShape("image", {
                attrs: {
                    x: 140,
                    y: 10,
                    width: 25,
                    height: 25,
                    img:
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAlCAYAAAAuqZsAAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAARMSURBVFhHvZjNbtRWFMct8QSFN6AvQHkB4AnaFyjddQtblhGrgJAqtUsqwaZQsQKEIBILEBCgixaQCERBSQhQSOZ7Mh+Zmcwc/DvJsa5v7jieqdMr/SWPfT5+Pufea3siCYzRaKQaDoeyvb0tg8FA+v2+9Ho92drakm6sTrcr3VidTiclPce12AZbfPAlBrGIafGzxh4wF8oFIhFJ/y235MZfFfnp9w9y6uKKfDfzTg79vKDimHNcwwZbfPB1AfPApcAMyKpkQFTi2VJdfvjtfQKRV/jgq9XcBfSrFxoJmAvFndEGWvLmY1MrEEo6iYhBLGISmxxZcAq2Byq+K+7wz+dlOXzmbTDRNCLW3KuaxiZHFlw0DurSvfVg8CJE7P3gFGwP1NxGMGCRIocPB4vBRZAyGXVOxYa0LxToIJS0Nc7trlYFs9XHpFz40Ch0Tu0ncpGT3LZaDS6ijCzjdrstp6dYfd+eW5KZWyUVxyGbLJGT3DC4LY20WnE55xerQcdxAuLKk5qWvd4ZqhicmxSQ3DC4VYsgbbVa8v2vq0EnXyS99aKpEFuDkczeK8mRs4uqmdsbUwGSGwar2g5Y3N+PG82gg69f7lc0KckfLLak0R1Krb2tbQQMGx8QHz9OSJubm/r4omq0M6K/13OsxLnXrbj3EgO15ehuJVwIHxAbbPHB140VEgyw2AqNKOGPl9eCxq6eLHVkrdLXKmRVaaeabbVhvFvvqa8fzxcMbjsjSnjywkrQ2NXDOBli3lyd35n0LiCavVuWbn+nhbdfNtUWYPxCMV3BAAtbh4I1m83Uq8s4GZj9dgHbvZGKwTl30ucFgwEWm2cKFjL05YOZgPjSGKhcIFNeMASLbRtR4z+CIeYUCl2bBAyWFNixKVrpqggwGFJglG+SyR+6VgQYDKlW8iPPdnHzn6a8WOsmW4SrcWDYch5f/5ovGGBJJj9L9NqzUtDY1fHzy8GNFPlgXMMGW3zwtWvjBENqu2BTe/+5FjT25W4RLqCBuUAMf+vIUq1eT2+wPAaYdHkf4sgHXC33VdMAIXLDkHok0VNK+PhtvoetKxeQMSmQidwwpB7i9tpTbzRyLYKiRU5yu23U1x4IWaKsiFerVfnmf3y1Jhc53W0ieVGEEFKba9eeHvwXkunO36Vkblm1kldrCLVqu3ONsl68+yUYqEiRg1y2RbjVUjAOOGGfbxiydA8SjtjkUKg4Z/DzjQPKRxntg5ee40hbi5xzxKJ9xLZ5NfaDlwNIfThr68vlciGrlRjEStrnQbnVYmT+qUIAJme1VpNHC6WJNmETPvgSg1h5oBj7/g3FiqHs3CnBVz5V5I/5da3Aidnl1CsTx5zjGjaVSkV98CUGsYhJ7CwoRu4/7tgArYLMERJWq1UVAAqx+5tr2FiF8CUGsWz1ZUExUmAMDA2QANyZAfLI4K4NkiogAJD9Nhjdn2IfAyKWu/rGQYmIfAXuNFIXGDKDxgAAAABJRU5ErkJggg==",
                },
                name: "image-shape",
            });

            if (cfg.status) {

                // status for image
                group.addShape("image", {
                    attrs: {
                        x: 10,
                        y: 28,
                        width: 15,
                        height: 15,
                        img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAWCAYAAADNX8xBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB9SURBVDhPY/hPJTBqEGGA16CvL/b8f3e9C4xBbHwAq0F/f338/+xI4P/bqzlRMEgMJIcNYDUImyEwDJLDBjAMAnkBmwHIGJs3MQwChQc2zcgYpAYd0M4gqnkNBKgS2CBAteiHAZAXQOEBwti8gwzwGkQKGDWIMBhsBv3/DwDcG87QKj2jmwAAAABJRU5ErkJggg=="
                    },
                    name: "image-shape",
                });

                //status for text
                group.addShape("text", {
                    attrs: {
                        y: 40,
                        x: 25,
                        height: 16,
                        width: 16,
                        text: "In progress.",
                        fontStyle: "oblique",
                        fill: "gray",
                        fontSize: 10,
                    },
                    name: "title",
                });

                //time for image
                group.addShape("image", {
                    attrs: {
                        x: 90,
                        y: 28,
                        width: 15,
                        height: 15,
                        img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAaCAYAAACtv5zzAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAF4SURBVEhL7ZQ9S8MxEIf9mI7iVtGlCh18AYWiQ1F0sIIuHVxU0KEIDoLg4CCCi4ib4iCoa11PnjQHeWsSwW594Gi43OWX/901UzJmJgJFigI3t3cyPdPwDF8tRYHXt3c5Pe/L/OKyMdb4aqkq0efXt7TW2sZY/4VIYP+wJ2cXfRkMfszv7FwzKtHC0orZA76os3dg1ikigfXNbXOIHqxluX94NKblcmNaq22bHRMJUAKT3GjK5dW19cawRwyxubIlS0RSblLYo4Q6Yb3jE7sT4wno7Tu7Xevx4dDu0fAClAuIzX2FJ6A3Cm9PMo2kuezzlYrmqGCIJ0ADCQ7nnBLgx8KGEouf3BRJgafnF+sZon7MvT0QWy2gwanp0TGlDy7Epi6leAJAMLUOD0pBDLGMa5qPWECbxrSUqBnpSAA0cWNrJ/mw4eNdIibsSUhSAGia/lMpA2Pqjip7oxrrMlIAmH9GlPeJAzHW+HLPg0tW4D+YCBQZs4DIL0rDBl0skTbvAAAAAElFTkSuQmCC"
                    },
                    name: "image-shape",
                });

                //time for text
                group.addShape("text", {
                    attrs: {
                        y: 42,
                        x: 103,
                        text: "3m 55s",
                        fill: "gray",
                        fontSize: 10,
                    },
                    name: "title",
                });
            }

            return shape;
        },
        setState(name: any, value: any, item: any) {
            const group = item.getContainer();
            if (name === "hover" && value) {
                const lightColor = "lightblue";
                const collapsed = true;
                const rectConfig = {
                    lineWidth: 1,
                    fontSize: 12,
                    fill: "#fff",
                    radius: 24,
                    stroke: lightColor,
                    opacity: 1,
                };

                group.addShape("circle", {
                    name: "test",
                    attrs: {
                        x: 192,
                        y: 25,
                        r: 8,
                        stroke: lightColor,
                        fill: collapsed ? lightColor : "",
                        isCollapseShape: true,
                    },
                });

                group.addShape("text", {
                    name: "right-plus",
                    attrs: {
                        x: 192,
                        y: 25,
                        width: 20,
                        height: 20,
                        textAlign: "center",
                        textBaseline: "middle",
                        text: collapsed ? "+" : "-",
                        fontSize: 10,
                        fill: collapsed ? "#00000" : lightColor,
                        cursor: "pointer",
                        isCollapseShape: true,
                    },
                });

                group.addShape("circle", {
                    name: "test",
                    attrs: {
                        x: 90,
                        y: 53,
                        r: 8,
                        stroke: lightColor,
                        fill: collapsed ? lightColor : "",
                        isCollapseShape: true,
                    },
                });
                group.addShape("text", {
                    name: "bottom-plus",
                    attrs: {
                        x: 90,
                        y: 53,
                        width: 16,
                        height: 16,
                        textAlign: "center",
                        textBaseline: "middle",
                        text: collapsed ? "+" : "-",
                        fontSize: 10,
                        fill: collapsed ? "#00000" : lightColor,
                        cursor: "pointer",
                        isCollapseShape: true,
                    },
                });

            }

            if (name === "hover" && !value) {
                const shape = group.get("children");
                console.log(shape);
                setTimeout(() => {
                    group.removeChild(group.get("children")[shape.length - 2]);
                    group.removeChild(group.get("children")[shape.length - 1]);
                }, 100);
                setTimeout(() => {
                    group.removeChild(group.get("children")[shape.length - 2]);
                    group.removeChild(group.get("children")[shape.length - 1]);
                }, 100);
            }

            if (name === "click") {
                let shape = group.get("children")[2];
                shape.attr({ text: value });
            }
            if (name === "succeed") {
                const shapeImg = group.get("children")[4];
                const shapeText = group.get("children")[5];
                shapeImg.attr({
                    img:
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAXCAYAAAAP6L+eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGSSURBVEhL7ZFLSwJRGIb7PwVREfQDKrRQutIiohIKKlu0iIgW7YOiP9DeMgLRvCUVWmAJkUFQVBQaXTXLyzg6zrydM3OwaLRUaOczu/N985z3O18N/omqOE9VnKdisUS+pJDCyes5PjIJiJLEKgoViamUynbCBxhwT8Ny6wEnpFlVoWwxlcazSbjCXrRbh1G3rkG/awovXJR1KJQtpsnsoX20EWmtSYNW6xDOopfIigLrUChLzIsZeWytbZQk1aJj24Bg5AKClGMdX6jEoiQiwscw71+SF5PO8fI5n8vAfOOA3jGO+o1O9JHx/U+nJGlWrv9EJY5l4lgJrqFlq5e8nRHehwDe+HeYrmzocU6iwazDoGeGnB/nLy2ESkybfY8BaMi4NBmVLBwtk4RGNJr1GNmdhef+ECmBY38URiWmW0+RBVnuPNDZx+SEzZtdaCJSw94cXCEfktkU6y5O0eXRRdE37XZOyEkVqReJEqSUomIKXZjp2obFwCrcYV/JUsqvYgqVP3ORksb/zp/iSqmKGcAncmSXV+WwdxEAAAAASUVORK5CYII=",
                })

                shapeText.attr({
                    text: "Succeed. ",
                    fontStyle: "",
                })
            }
            if (name === "failed") {
                const shapeImg = group.get("children")[4];
                const shapeText = group.get("children")[5];
                shapeImg.attr({
                    img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAVCAYAAABLy77vAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAADESURBVDhP7ZI9CgIxEEY9jBdYe93en1ovaWFr4QWEBYUV72AhCnbCmBd2Fk0yKwFtxAeB2czw8jFsTz7EX/Se74luh6PcL9fmK4YeMyGRaNsvpJ4tkjLu6DETEolOy5Uf3JeTl5epuaPHTEhyRyqrBiMv4FBbEjCXfV5vpCqGXuCPq7mzMEWgybqSKN2JmiSaLDtRuyMnaHfk6qwdqWRXjr1AoebOkkUiBuvp3P6PXI+ZkEjEyymJQu85qWIuO5efFYk8AGssmC7B7olJAAAAAElFTkSuQmCC"
                })
                shapeText.attr({
                    text: "Failed. ",
                    fontStyle: "",
                })
            }
            if (name === "pending") {
                const shapeImg = group.get("children")[4];
                const shapeText = group.get("children")[5];
                shapeImg.attr({
                    img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAWCAYAAADNX8xBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB9SURBVDhPY/hPJTBqEGGA16CvL/b8f3e9C4xBbHwAq0F/f338/+xI4P/bqzlRMEgMJIcNYDUImyEwDJLDBjAMAnkBmwHIGJs3MQwChQc2zcgYpAYd0M4gqnkNBKgS2CBAteiHAZAXQOEBwti8gwzwGkQKGDWIMBhsBv3/DwDcG87QKj2jmwAAAABJRU5ErkJggg=="
                })
                shapeText.attr({
                    text: "Pending. ",
                    fontStyle: "",
                })
            }
            if (name === "cancel") {
                const shapeImg = group.get("children")[4];
                const shapeText = group.get("children")[5];
                shapeImg.attr({
                    img: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAWCAYAAADNX8xBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB9SURBVDhPY/hPJTBqEGGA16CvL/b8f3e9C4xBbHwAq0F/f338/+xI4P/bqzlRMEgMJIcNYDUImyEwDJLDBjAMAnkBmwHIGJs3MQwChQc2zcgYpAYd0M4gqnkNBKgS2CBAteiHAZAXQOEBwti8gwzwGkQKGDWIMBhsBv3/DwDcG87QKj2jmwAAAABJRU5ErkJggg=="
                })
                shapeText.attr({
                    text: "Cancel. ",
                    fontStyle: "",
                })
            }
        },
    },
    "single-node"
);
