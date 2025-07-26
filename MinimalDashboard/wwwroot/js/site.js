//// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
//// for details on configuring this project to bundle and minify static web assets.

//// Write your JavaScript code.

//// Initialize visualization
////why it's not working
////function initTreeViz(containerId, data) {
////    const width = 800, height = 600;
////    const radius = Math.min(width, height) / 2 - 40;

////    const svg = d3.select(`#${containerId}`)
////        .attr("viewBox", `0 0 ${width} ${height}`)
////        .append("g")
////        .attr("transform", `translate(${width / 2},${height / 2})`);

////    // Create hierarchy from your data
////    const root = d3.hierarchy(data);

////    // Update function that handles view changes
////    function update(visualizationType, maxDepth, centerNode) {
////        svg.selectAll("*").remove();

////        if (visualizationType === 'sunburst') {
////            drawSunburst(root, maxDepth, centerNode);
////        } else {
////            drawRadialTree(root, maxDepth, centerNode);
////        }
////    }

////    // Sunburst implementation
////    function drawSunburst(root, maxDepth, centerNode) {
////        const partition = d3.partition()
////            .size([2 * Math.PI, radius])
////            .padding(0.5);

////        const arc = d3.arc()
////            .startAngle(d => d.x0)
////            .endAngle(d => d.x1)
////            .innerRadius(d => d.y0)
////            .outerRadius(d => d.y1);

////        const nodes = partition(root).descendants()
////            .filter(d => d.depth <= maxDepth);

////        svg.selectAll("path")
////            .data(nodes)
////            .enter().append("path")
////            .attr("d", arc)
////            .attr("fill", d => depthColorScale(d.depth))
////            .on("mouseover", handleMouseOver)
////            .on("click", handleNodeClick);
////    }

////    // Radial tree implementation
////    function drawRadialTree(root, maxDepth, centerNode) {
////        const treeLayout = d3.tree()
////            .size([2 * Math.PI, radius])
////            .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

////        const nodes = treeLayout(root).descendants()
////            .filter(d => d.depth <= maxDepth);

////        // Draw links
////        svg.selectAll(".link")
////            .data(nodes.slice(1))
////            .enter().append("path")
////            .attr("class", "link")
////            .attr("d", d3.linkRadial()
////                .angle(d => d.x)
////                .radius(d => d.y));

////        // Draw nodes
////        svg.selectAll(".node")
////            .data(nodes)
////            .enter().append("circle")
////            .attr("class", "node")
////            .attr("r", d => 8 - d.depth)
////            .attr("transform", d => `
////                rotate(${d.x * 180 / Math.PI - 90})
////                translate(${d.y},0)
////            `)
////            .on("mouseover", handleMouseOver)
////            .on("click", handleNodeClick);
////    }

////    // Interactive functions
////    function handleMouseOver(event, d) {
////        Alpine.store('hoveredNode', {
////            id: d.data.id,
////            name: d.data.name,
////            type: ['Subject', 'Chapter', 'Topic', 'PDF'][d.depth - 1],
////            pdfCount: d.data.pdfCount
////        });
////    }

////    function handleNodeClick(event, d) {
////        Alpine.store('centerNode', d);
////        update(Alpine.store('visualizationType'), Alpine.store('maxDepth'), d);
////    }

////    return { update };
////}
//function dashboardApp() {
//    return {
//        // Visualization state
//        visualizationType: 'sunburst',
//        maxDepth: 3,
//        centerNode: null,
//        hoveredNode: null,

//        // Data state
//        searchQuery: '',
//        selectedSubject: null,
//        dashboardData: { Subjects: [] },

//        // Initialize with data from server
//        initDashboard(data) {
//            this.dashboardData = data;
//            this.$nextTick(() => {
//                this.initTreeViz('tree-viz', this.convertToHierarchy(this.dashboardData));
//            });
//        },

//        // Computed properties
//        get totalChapters() {
//            return this.dashboardData.Subjects.reduce((sum, subject) => sum + subject.Chapters.length, 0);
//        },

//        get totalPdfs() {
//            let count = 0;
//            this.dashboardData.Subjects.forEach(subject => {
//                subject.Chapters.forEach(chapter => {
//                    count += chapter.pdfCount || 0;
//                });
//            });
//            return count;
//        },

//        get recentResources() {
//            const resources = [];
//            this.dashboardData.Subjects.forEach(subject => {
//                subject.Chapters.forEach(chapter => {
//                    if (chapter.Topics) {
//                        chapter.Topics.forEach(topic => {
//                            if (topic.Books) {
//                                topic.Books.forEach(book => {
//                                    resources.push({
//                                        ...book,
//                                        SubjectName: subject.SubjectName,
//                                        ChapterName: chapter.ChapterName
//                                    });
//                                });
//                            }
//                        });
//                    }
//                });
//            });
//            return resources.slice(0, 5);
//        },

//        // Methods
//        selectSubject(subject) {
//            this.selectedSubject = subject;
//        },

//        convertToHierarchy(data) {
//            const rootNode = {
//                name: "Learning Resources",
//                id: 0,
//                type: "root",
//                children: data.Subjects.map(subject => ({
//                    name: subject.SubjectName,
//                    id: subject.SubId,
//                    type: "subject",
//                    contentType: subject.ContentType,
//                    children: subject.Chapters.map(chapter => ({
//                        name: chapter.ChapterName || "Unnamed Chapter",
//                        id: chapter.ChapterId,
//                        type: "chapter",
//                        pdfCount: chapter.pdfCount || 0,
//                        children: (chapter.Topics || []).map(topic => ({
//                            name: topic.TopicName || "Unnamed Topic",
//                            id: topic.TopicId,
//                            type: "topic",
//                            pdfCount: topic.PdfCount || 0,
//                            children: (topic.Books || []).map(book => ({
//                                name: book.BookName || "Unnamed PDF",
//                                id: book.AutoId,
//                                type: "pdf",
//                                pdfUrl: book.PdfUrl
//                            }))
//                        }))
//                    }))
//                }))
//            };
//            return rootNode;
//        },

//        initTreeViz(containerId, data) {
//            const width = document.getElementById(containerId).clientWidth;
//            const height = document.getElementById(containerId).clientHeight;
//            const radius = Math.min(width, height) / 2 - 40;

//            const svg = d3.select(`#${containerId}`)
//                .attr("viewBox", `0 0 ${width} ${height}`)
//                .append("g")
//                .attr("transform", `translate(${width / 2},${height / 2})`);

//            const root = d3.hierarchy(data);

//            // Create tooltip
//            const tooltip = d3.select("body").append("div")
//                .attr("class", "tooltip")
//                .style("opacity", 0);

//            const depthColorScale = (depth) => {
//                const colors = ["#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b"];
//                return colors[depth % colors.length];
//            };

//            const update = (visualizationType, maxDepth, centerNode) => {
//                svg.selectAll("*").remove();

//                if (visualizationType === 'sunburst') {
//                    drawSunburst(root, maxDepth, centerNode);
//                } else {
//                    drawRadialTree(root, maxDepth, centerNode);
//                }
//            };

//            const drawSunburst = (root, maxDepth) => {
//                const partition = d3.partition()
//                    .size([2 * Math.PI, radius])
//                    .padding(1);

//                const arc = d3.arc()
//                    .startAngle(d => d.x0)
//                    .endAngle(d => d.x1)
//                    .innerRadius(d => d.y0)
//                    .outerRadius(d => d.y1);

//                const nodes = partition(root).descendants()
//                    .filter(d => d.depth <= maxDepth);

//                const path = svg.selectAll("path")
//                    .data(nodes)
//                    .enter().append("path")
//                    .attr("d", arc)
//                    .attr("fill", d => depthColorScale(d.depth))
//                    .attr("stroke", "#fff")
//                    .attr("stroke-width", 1)
//                    .on("mouseover", (event, d) => {
//                        this.hoveredNode = {
//                            id: d.data.id,
//                            name: d.data.name,
//                            type: d.data.type,
//                            pdfCount: d.data.pdfCount,
//                            contentType: d.data.contentType
//                        };

//                        tooltip.transition()
//                            .duration(200)
//                            .style("opacity", .9);
//                        tooltip.html(`<strong>${d.data.name}</strong><br/>${d.data.type}<br/>${d.data.pdfCount || 0} PDFs`)
//                            .style("left", (event.pageX + 10) + "px")
//                            .style("top", (event.pageY - 28) + "px");
//                    })
//                    .on("mouseout", () => {
//                        tooltip.transition()
//                            .duration(500)
//                            .style("opacity", 0);
//                    })
//                    .on("click", (event, d) => {
//                        this.centerNode = d;
//                        update(this.visualizationType, this.maxDepth, d);
//                    });

//                // Add labels
//                const text = svg.selectAll("text")
//                    .data(nodes)
//                    .enter().append("text")
//                    .attr("class", "node-label")
//                    .attr("transform", d => {
//                        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI - 90;
//                        const y = (d.y0 + d.y1) / 2;
//                        return `rotate(${x}) translate(${y},0) rotate(${x > 90 ? -90 : 90})`;
//                    })
//                    .attr("dy", "0.35em")
//                    .attr("text-anchor", "middle")
//                    .text(d => d.data.name.length > 15 ? d.data.name.substring(0, 15) + "..." : d.data.name)
//                    .style("fill", "#fff")
//                    .style("font-weight", "bold")
//                    .style("pointer-events", "none");
//            };

//            const drawRadialTree = (root, maxDepth) => {
//                const treeLayout = d3.tree()
//                    .size([2 * Math.PI, radius])
//                    .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);

//                const nodes = treeLayout(root).descendants()
//                    .filter(d => d.depth <= maxDepth);

//                // Draw links
//                svg.selectAll(".link")
//                    .data(nodes.slice(1))
//                    .enter().append("path")
//                    .attr("class", "link")
//                    .attr("d", d3.linkRadial()
//                        .angle(d => d.x)
//                        .radius(d => d.y))
//                    .attr("fill", "none")
//                    .attr("stroke", "#94a3b8")
//                    .attr("stroke-opacity", 0.4)
//                    .attr("stroke-width", 1.5);

//                // Draw nodes
//                const node = svg.selectAll(".node")
//                    .data(nodes)
//                    .enter().append("g")
//                    .attr("transform", d => `
//                                rotate(${d.x * 180 / Math.PI - 90})
//                                translate(${d.y},0)
//                            `);

//                node.append("circle")
//                    .attr("r", d => 8 - d.depth)
//                    .attr("fill", d => depthColorScale(d.depth))
//                    .attr("stroke", "#fff")
//                    .attr("stroke-width", 1.5)
//                    .on("mouseover", (event, d) => {
//                        this.hoveredNode = {
//                            id: d.data.id,
//                            name: d.data.name,
//                            type: d.data.type,
//                            pdfCount: d.data.pdfCount,
//                            contentType: d.data.contentType
//                        };

//                        tooltip.transition()
//                            .duration(200)
//                            .style("opacity", .9);
//                        tooltip.html(`<strong>${d.data.name}</strong><br/>${d.data.type}<br/>${d.data.pdfCount || 0} PDFs`)
//                            .style("left", (event.pageX + 10) + "px")
//                            .style("top", (event.pageY - 28) + "px");
//                    })
//                    .on("mouseout", () => {
//                        tooltip.transition()
//                            .duration(500)
//                            .style("opacity", 0);
//                    })
//                    .on("click", (event, d) => {
//                        this.centerNode = d;
//                        update(this.visualizationType, this.maxDepth, d);
//                    });

//                // Add labels
//                node.append("text")
//                    .attr("class", "node-label")
//                    .attr("dy", "0.35em")
//                    .attr("x", d => d.x < Math.PI ? 12 : -12)
//                    .attr("text-anchor", d => d.x < Math.PI ? "start" : "end")
//                    .attr("transform", d => d.x >= Math.PI ? "rotate(180)" : null)
//                    .text(d => d.data.name.length > 12 ? d.data.name.substring(0, 12) + "..." : d.data.name)
//                    .style("fill", "#1e293b");
//            };

//            // Initial draw
//            update(this.visualizationType, this.maxDepth, null);

//            // Watch for changes
//            this.$watch('visualizationType', () => {
//                update(this.visualizationType, this.maxDepth, this.centerNode);
//            });

//            this.$watch('maxDepth', () => {
//                update(this.visualizationType, this.maxDepth, this.centerNode);
//            });

//            this.$watch('centerNode', () => {
//                update(this.visualizationType, this.maxDepth, this.centerNode);
//            });
//        }
//    }
//}
