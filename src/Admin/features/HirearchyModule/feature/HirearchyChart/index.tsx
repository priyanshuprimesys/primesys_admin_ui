import { useContext, useMemo } from 'react';
import { ReactFlow, Controls, Background, Node, Edge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { HirearchyModuleParentContext } from '../../../../../contexts/AppLayout/Admin/HirearchyModuleContext/HirearchyModuleParentContext/HirearchyModuleParentContext';
import { IDivisionParentIdInterface } from '../../../../../interfaces/AppInterfaces/DivisionInterface/DivisionParentIdInterface/DivisionParentIdInterface';
import { getDesignation } from '../../hooks/getDesignation';

/* ── colour per designation level ───────────────────────────────────────── */

const LEVEL_STYLE: Record<number, { bg: string; border: string; text: string }> = {
    1: { bg: "#1a202c", border: "#2d3748", text: "#fff"    },  // Control
    2: { bg: "#2b6cb0", border: "#2c5282", text: "#fff"    },  // DEN
    3: { bg: "#6b46c1", border: "#553c9a", text: "#fff"    },  // ADEN
    4: { bg: "#c05621", border: "#9c4221", text: "#fff"    },  // PWAY
    5: { bg: "#b83280", border: "#97266d", text: "#fff"    },  // Jr PWAY
};

const NODE_W = 180;
const NODE_H = 60;
const X_GAP  = 220;
const Y_GAP  = 130;

/* ── build nodes and edges from hierarchy data ───────────────────────────── */

const getOwnDeviceCount = (node: IDivisionParentIdInterface): number => {
    if (Array.isArray(node.device_imeis)) {
        return node.device_imeis.filter(x => String(x).trim() !== '').length;
    }
    if (node.device_list) {
        return node.device_list.split(',').filter(x => x.trim() !== '').length;
    }
    return 0;
};

const buildCumulativeMap = (data: IDivisionParentIdInterface[]): Map<string, number> => {
    const map = new Map<string, number>();
    data.forEach(node => {
        const total = data
            .filter(item => {
                if (item.id === node.id) return true;
                const parts = item.path?.split(',').filter(p => p.trim() !== '') ?? [];
                return parts.includes(node.id);
            })
            .reduce((sum, item) => sum + getOwnDeviceCount(item), 0);
        map.set(node.id, total);
    });
    return map;
};

const buildGraph = (data: IDivisionParentIdInterface[]) => {
    const devMap = buildCumulativeMap(data);
    // group by dept_id (level)
    const byLevel: Record<number, IDivisionParentIdInterface[]> = {};
    data.forEach(item => {
        const lvl = item.dept_id ?? 1;
        if (!byLevel[lvl]) byLevel[lvl] = [];
        byLevel[lvl].push(item);
    });

    const nodes: Node[] = data.map(item => {
        const lvl     = item.dept_id ?? 1;
        const peers   = byLevel[lvl] || [];
        const idx     = peers.indexOf(item);
        const count   = peers.length;
        const x       = (idx - (count - 1) / 2) * X_GAP;
        const y       = (lvl - 1) * Y_GAP;
        const style   = LEVEL_STYLE[lvl] ?? LEVEL_STYLE[5];
        const devCount = devMap.get(item.id) ?? 0;
        const ownCount = getOwnDeviceCount(item);

        return {
            id:       item.id,
            position: { x, y },
            data:     {
                label: (
                    <div style={{ fontFamily: "sans-serif", lineHeight: 1.3, textAlign: "center" }}>
                        <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 2 }}>{item.name}</div>
                        <div style={{ fontSize: 10, opacity: 0.85 }}>{getDesignation(lvl)}</div>
                        <div style={{ fontSize: 10, marginTop: 3, opacity: 0.75 }}>
                            {devCount} total{ownCount !== devCount ? ` (${ownCount} own)` : ''} · {item.active_status ? '● Active' : '○ Inactive'}
                        </div>
                    </div>
                )
            },
            style: {
                background:   style.bg,
                border:       `2px solid ${style.border}`,
                color:        style.text,
                borderRadius: 10,
                width:        NODE_W,
                minHeight:    NODE_H,
                padding:      "8px 10px",
                opacity:      item.active_status ? 1 : 0.55,
            },
        };
    });

    const edges: Edge[] = data
        .map(item => {
            // parent id = last non-empty segment of path
            const parts = item.path?.split(',').filter(p => p.trim() !== '') ?? [];
            if (parts.length === 0) return null;
            const parentId = parts[parts.length - 1];
            if (!data.some(d => d.id === parentId)) return null;
            return {
                id:           `${parentId}-${item.id}`,
                source:       parentId,
                target:       item.id,
                type:         'smoothstep',
                style:        { stroke: '#94a3b8', strokeWidth: 1.5 },
                animated:     false,
            } as Edge;
        })
        .filter((e): e is Edge => e !== null);

    return { nodes, edges };
};

/* ── component ───────────────────────────────────────────────────────────── */

export default function HierarchyChart() {
    const { hirearchyParentDetailData } = useContext(HirearchyModuleParentContext);
    const allNodes: IDivisionParentIdInterface[] = hirearchyParentDetailData.data.result;

    const { nodes, edges } = useMemo(
        () => buildGraph(allNodes),
        [allNodes]
    );

    if (allNodes.length === 0) {
        return (
            <div className="w-full h-[70vh] border-2 border-gray-300 rounded-xl flex items-center justify-center text-gray-400">
                <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p className="font-medium">Select a parent division to view the hierarchy tree</p>
                </div>
            </div>
        );
    }

    /* legend */
    const levels = [
        { dept: 1, label: "Control" },
        { dept: 2, label: "DEN"     },
        { dept: 3, label: "ADEN"    },
        { dept: 4, label: "PWAY"    },
        { dept: 5, label: "Jr PWAY" },
    ].filter(l => hirearchyParentDetailData.data.result.some(x => x.dept_id === l.dept));

    return (
        <div className="w-full flex flex-col gap-2">
            {/* legend */}
            <div className="flex items-center gap-3 flex-wrap px-1">
                {levels.map(l => (
                    <div key={l.dept} className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: LEVEL_STYLE[l.dept]?.bg }} />
                        <span className="text-xs font-semibold text-gray-600">{l.label}</span>
                    </div>
                ))}
                <span className="ml-auto text-xs text-gray-400">{hirearchyParentDetailData.data.result.length} nodes</span>
            </div>

            <div className="w-full h-[72vh] border-2 border-gray-200 rounded-xl overflow-hidden">
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                    fitViewOptions={{ padding: 0.2 }}
                    nodesDraggable
                    nodesConnectable={false}
                    elementsSelectable
                >
                    <Controls />
                    <Background color="#e2e8f0" gap={20} size={1} />
                </ReactFlow>
            </div>
        </div>
    );
}
