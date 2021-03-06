/**
 * @polymerBehavior
 */
export const KwcFileManagerBehavior = {
    properties: {
        /**
         * Root of the file tree. Each node have a name, and can have children
         */
        rootDir: {
            type: Object,
            observer: '_rootDirChanged'
        },
        /**
         * Current path of the explorer
         */
        path: {
            type: String
        },
        /**
         * Bound to the path, the nodes constituting the path of the explorer
         */
        breadcrumbs: {
            type: Array,
            notify: true,
            readOnly: true,
            computed: '_computeBreadCrumbs(path)'
        },
        /**
         * Current directory displayed in the explorer
         */
        directory: {
            type: Object,
            computed: '_computeDirectory(breadcrumbs, rootDir.*)',
            readOnly: true,
            notify: true
        },
        /**
         * Current file list displayed in the explorer
         */
        fileList: {
            type: Array,
            computed: '_computeFileList(directory)',
            readOnly: true
        },
        /**
         * Defines which property is the `name` of a node
         */
        nameProp: {
            type: String,
            value: 'name'
        },
        /**
         * Defines which property are the `children` of a node
         */
        childrenProp: {
            type: String,
            value: 'children'
        },
        /**
         * Index poiting to the selected node in the file list of the selected path
         */
        selectedIndex: {
            type: Number,
            value: null
        },
        /**
         * Path of the selected node
         */
        selectedPath: {
            type: String,
            value: null
        }
    },
    listeners: {
        'path-link-tapped': '_pathLinkTapped',
        'tap': '_onTap'
    },
    _directoryCache: {},
    _rootDirChanged () {
        if (!this.path) {
            this.goToPath('/' + this.rootDir.name);
        }
    },
    _computeBreadCrumbs (path) {
        return path.split('/').filter(name => !!name && name !== '');
    },
    _computeDirectory () {
        return this._getDirectory(this.breadcrumbs, this.path);
    },
    _getDirectory (breadcrumbs = [], path) {
        if (!this._directoryCache[path]) {
            let dir = this.rootDir;
            const parts = breadcrumbs.slice(0);
            let part;
            while (dir && (part = parts.shift())) {
                for (let i = 0; i < dir[this.childrenProp].length; i++) {
                    if (dir[this.childrenProp][i][this.nameProp] === part) {
                        dir = dir[this.childrenProp][i];
                        break;
                    }
                }
            }
            this._directoryCache[path] = dir;
        }
        return this._directoryCache[path];
    },
    _computeFileList () {
        return this.directory[this.childrenProp];
    },
    /**
     * Moves the current path to the parent directory.
     * Will not move up if the current directory is the root
     */
    goHigher () {
        if (this.breadcrumbs.length <= 1) {
            return;
        }
        const parts = this.breadcrumbs.slice(0, this.breadcrumbs.length - 1);
        this.goToPath('/' + parts.join('/'));
    },
    _onTap (e) {
        const target = e.path ? e.path[0] : e.target;
        const name = target.getAttribute('path-name');
        if (name === null) {
            return;
        }
        this.goToPath(this.path + '/' + name);
    },
    _pathLinkTapped (e) {
        const path = e.detail;
        this.goToPath(path);
    },
    /**
     * Jumps to a specific path in the file tree.
     * Prevents jumping to a non existing directory.
     */
    goToPath (p) {
        const parts = this._computeBreadCrumbs(p);
        const dir = this._getDirectory(parts, p);
        if (!dir[this.childrenProp]) {
            parts.pop();
        }
        this.path = '/' + parts.join('/');
    },
    /**
     * For a given node, tells if it has children
     */
    hasChildren (node) {
        return !!node[this.childrenProp];
    },
    /**
     * Sets a node to be selected.
     * Sets `selectedIndex` and `selectedPath`
     */
    select (name, path) {
        this.selectedPath = path;
        const directory = this._getDirectory(this._computeBreadCrumbs(this.selectedPath), this.selectedPath);
        const files = directory.children;
        for (let i = 0; i < files.length; i++) {
            if (files[i][this.nameProp] === name) {
                this.selectedIndex = i;
                break;
            }
        }
    },
    /**
     * For a given node index, selectedindex and selectedPath,
     * tells if that index at the current path is the index of a selected node
     */
    isSelected (index, selectedIndex, selectedPath) {
        return index === selectedIndex && selectedPath === this.path;
    },
    /**
     * Sets the current path to display the directory
     * where the selected node is
     */
    goToSelected () {
        this.path = this.selectedPath;
    }
};
