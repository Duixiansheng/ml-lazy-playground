const palette = {
  blue: "#2f6db1",
  blueFill: "rgba(47, 109, 177, 0.14)",
  orange: "#ea8a3a",
  orangeFill: "rgba(234, 138, 58, 0.14)",
  green: "#2b8f72",
  rose: "#c65b75",
  text: "#223047",
  soft: "#5d6b7d",
  grid: "rgba(34, 48, 71, 0.1)",
  bg: "#f8f2ea",
  cluster: ["#4573c4", "#de8d3c", "#4da979", "#bf5a76"],
  clusterFill: [
    "rgba(69, 115, 196, 0.13)",
    "rgba(222, 141, 60, 0.13)",
    "rgba(77, 169, 121, 0.13)",
    "rgba(191, 90, 118, 0.13)",
  ],
};

const classificationState = {
  points: [],
  tool: "A",
  model: "knn",
  k: 3,
  query: null,
  linearModel: null,
};

const regressionState = {
  points: [],
  learningRate: 0.04,
  noise: 1.4,
  w: 0,
  b: 0,
  step: 0,
  lossHistory: [],
  autoTimer: null,
};

const clusteringState = {
  points: [],
  k: 3,
  centroids: [],
  assignments: [],
  phase: "assign",
  iteration: 0,
  stable: false,
  lastShift: null,
  autoTimer: null,
};

const quizState = {
  index: 0,
  selected: null,
  answered: false,
};

const applicationCards = [
  {
    title: "垃圾邮件过滤",
    task: "分类",
    description: "系统已经知道什么叫垃圾邮件、什么叫正常邮件，所以它要做的是把新邮件分到正确类别。",
    why: "有标签、有明确类别，是标准的监督学习分类任务。",
  },
  {
    title: "房价预测",
    task: "回归",
    description: "输入面积、地段、楼龄等特征，输出的是一个连续数值，而不是固定类别。",
    why: "目标是一个数，所以应该用回归。",
  },
  {
    title: "客户分群",
    task: "聚类",
    description: "电商平台往往先不知道顾客天然分成几类，只能根据消费行为把相似用户聚在一起。",
    why: "一开始没有标签，因此更像无监督学习。",
  },
  {
    title: "遥感地物分割",
    task: "图像分割",
    description: "不是判断整张图是什么，而是给图上每个像素一个类别，比如沟蚀区、非沟蚀区、植被、水体。",
    why: "这类任务会用到 U-Net 等语义分割模型，和你这个仓库方向也很相关。",
  },
  {
    title: "推荐系统",
    task: "综合应用",
    description: "推荐常常不只是一种模型，里面会混合排序、召回、相似度学习、用户分群等多个环节。",
    why: "真实工业应用里，机器学习经常不是单一模型，而是一整套流程。",
  },
  {
    title: "异常检测",
    task: "偏无监督",
    description: "例如银行反欺诈、设备故障预警，经常先找出和正常行为差异很大的样本。",
    why: "如果异常样本很少，常常会先建模“正常是什么样”，再找偏离者。",
  },
];

const quizQuestions = [
  {
    question: "已知一批邮件被人工标注为“垃圾”或“正常”，现在要判断新邮件属于哪一类。",
    answer: "分类",
    options: ["分类", "回归", "聚类", "图像分割"],
    explanation:
      "这是最典型的分类任务。因为你已经有明确标签，模型学的是“输入什么特征时更像垃圾邮件”。",
  },
  {
    question: "根据房屋面积、朝向、楼龄、地段，预测一套房子的成交价格。",
    answer: "回归",
    options: ["分类", "回归", "聚类", "异常检测"],
    explanation:
      "输出是价格，是连续数值，不是固定类别，所以这题是回归。很多人会把“高价房/低价房”误当成标签，但这里真正要预测的是具体数字。",
  },
  {
    question: "没有任何用户标签，只想根据消费习惯把用户自然分成若干组，方便后续运营。",
    answer: "聚类",
    options: ["分类", "回归", "聚类", "图像分割"],
    explanation:
      "没有现成标签时，先做聚类非常常见。它不是给出标准答案，而是帮你发现结构。",
  },
  {
    question: "一张遥感图像里，要把每个像素标成沟蚀区、非沟蚀区、道路或植被。",
    answer: "图像分割",
    options: ["分类", "回归", "聚类", "图像分割"],
    explanation:
      "这里的目标不是整张图一个标签，而是每个像素一个标签，所以属于图像分割。U-Net 就是这类任务的常见方法。",
  },
  {
    question: "一家银行每天看交易记录，想先找出和正常消费习惯差异特别大的可疑行为。",
    answer: "异常检测",
    options: ["分类", "回归", "聚类", "异常检测"],
    explanation:
      "如果异常样本很少，直接做分类往往不稳。此时常用异常检测，先学正常，再找偏离特别大的样本。",
  },
];

const modelCards = [
  {
    name: "线性回归",
    family: "回归模型",
    use: "用一条线或一个平面去拟合连续数值关系。",
    fit: "适合先做基线、看特征和目标是不是大致线性相关。",
  },
  {
    name: "逻辑回归",
    family: "分类模型",
    use: "经典二分类模型，输出更像某一类的概率。",
    fit: "适合入门分类、可解释性分析、做一个稳妥起点。",
  },
  {
    name: "kNN",
    family: "实例模型",
    use: "看最近邻居怎么投票或参考邻居数值。",
    fit: "适合建立直觉，也适合小数据集快速试验。",
  },
  {
    name: "决策树",
    family: "树模型",
    use: "像做选择题一样，一层层按条件分裂。",
    fit: "适合解释给组员听“模型为什么这样判断”。",
  },
  {
    name: "随机森林",
    family: "集成模型",
    use: "很多棵决策树一起投票或平均，通常比单棵树更稳。",
    fit: "适合中小规模表格数据，是很常见的强基线。",
  },
  {
    name: "梯度提升树",
    family: "集成模型",
    use: "一棵树接一棵树地修正前面的错误。",
    fit: "适合表格数据竞赛和工业任务，常见实现有 XGBoost、LightGBM、CatBoost。",
  },
  {
    name: "支持向量机 SVM",
    family: "分类模型",
    use: "努力找到一条间隔最大的分界线。",
    fit: "适合中小规模数据，尤其是在特征工程做得比较好的时候。",
  },
  {
    name: "朴素贝叶斯",
    family: "概率模型",
    use: "根据条件概率快速做分类判断。",
    fit: "适合文本分类入门，也适合讲“概率模型怎么做判断”。",
  },
  {
    name: "K-Means",
    family: "聚类模型",
    use: "没有标签时，先把相似样本自动抱团。",
    fit: "适合用户分群、功能区粗划分、探索性分析。",
  },
  {
    name: "DBSCAN",
    family: "聚类模型",
    use: "按密度找簇，不强迫每类都长得像圆团。",
    fit: "适合簇形状复杂、还想顺手发现离群点的场景。",
  },
  {
    name: "PCA",
    family: "降维方法",
    use: "把多维特征压缩成更少维度，同时尽量保留主要信息。",
    fit: "适合可视化、降噪、做预处理。",
  },
  {
    name: "MLP 全连接网络",
    family: "神经网络",
    use: "一层层线性变换加非线性激活，适合学习更复杂关系。",
    fit: "适合给组员理解“神经网络最基础的结构是什么”。",
  },
  {
    name: "CNN 卷积神经网络",
    family: "深度学习",
    use: "擅长处理图像和栅格数据，能自动提取局部空间特征。",
    fit: "适合图像分类、目标识别、遥感影像任务。",
  },
  {
    name: "RNN / LSTM / GRU",
    family: "序列模型",
    use: "擅长按顺序处理时间序列或文本序列。",
    fit: "适合讲时间依赖，但现在很多任务会被 Transformer 替代。",
  },
  {
    name: "Transformer",
    family: "序列与大模型",
    use: "通过注意力机制理解长距离关系，是大模型的重要基础。",
    fit: "适合文本、图像、多模态任务，是当下很关键的模型家族。",
  },
  {
    name: "U-Net",
    family: "分割模型",
    use: "把整体语义和局部细节结合起来，做像素级分割。",
    fit: "非常适合你们这种遥感分割、医学分割、区域提取任务。",
  },
  {
    name: "自编码器 Autoencoder",
    family: "表示学习",
    use: "先压缩再重建，逼模型学会更有用的内部表达。",
    fit: "适合降维、异常检测、表示学习入门。",
  },
  {
    name: "GAN",
    family: "生成模型",
    use: "让生成器和判别器对抗训练，生成逼真数据。",
    fit: "适合讲生成式模型思路，但训练通常比较难。",
  },
];

const glossaryItems = [
  {
    term: "机器学习",
    tag: "总概念",
    short: "让计算机从数据里学规律，而不是每一步都靠人手写死规则。",
    detail: "传统编程常常是人先把规则写好，机器照做；机器学习则是给机器很多例子，让它自己总结出模式。",
    example: "你不手写“什么样的邮件算垃圾邮件”，而是拿很多已标注邮件让模型自己学。",
  },
  {
    term: "样本",
    tag: "基础概念",
    short: "一条具体的数据记录，就是一个样本。",
    detail: "在图上一个点、表里一行、图片库里一张图，都可以算一个样本。",
    example: "一套房子的面积、地段、楼龄和价格合在一起，就是一个房价样本。",
  },
  {
    term: "特征",
    tag: "基础概念",
    short: "模型用来做判断的输入信息。",
    detail: "特征通常是样本里的已知条件，模型会根据这些条件去猜类别或数值。",
    example: "房屋面积、楼龄、朝向都可以是特征。",
  },
  {
    term: "标签",
    tag: "基础概念",
    short: "样本的标准答案。",
    detail: "监督学习里，标签告诉模型“这条数据的正确结果应该是什么”。",
    example: "一封邮件被人工标成“垃圾邮件”，这个类别就是标签。",
  },
  {
    term: "模型",
    tag: "基础概念",
    short: "根据数据学会规律的那个计算工具。",
    detail: "模型不是魔法，它只是把输入和输出之间的关系压缩成一套可重复使用的参数和规则。对先生给组员准备的这份学习用品里，也专门补了一页常见模型库。",
    example: "kNN、线性分类器、随机森林、U-Net 都是模型。",
  },
  {
    term: "监督学习",
    tag: "学习范式",
    short: "训练时有标准答案的学习方式。",
    detail: "模型在学习时既能看到输入，也能看到正确输出，所以能不断对照答案修正自己。",
    example: "垃圾邮件分类、房价预测都属于监督学习。",
  },
  {
    term: "无监督学习",
    tag: "学习范式",
    short: "训练时没有标准答案，只能自己找结构。",
    detail: "模型看不到正确标签，只能根据相似性、距离或分布，自己把数据组织起来。",
    example: "客户分群、部分异常检测场景常先用无监督学习。",
  },
  {
    term: "分类",
    tag: "核心任务",
    short: "预测一个样本属于哪一类。",
    detail: "输出是离散类别，而不是连续数值；重点是“归到哪个桶里”。",
    example: "把邮件分成垃圾邮件或正常邮件。",
  },
  {
    term: "回归",
    tag: "核心任务",
    short: "预测一个连续数值。",
    detail: "回归关心的是“具体是多少”，而不是“属于哪一类”。",
    example: "预测房价、销量、温度、产量。",
  },
  {
    term: "聚类",
    tag: "核心任务",
    short: "在没有标签时，把相似样本分成几组。",
    detail: "聚类不是给出标准答案，而是帮助你先发现数据的自然结构。",
    example: "把用户按消费习惯自动分成几群。",
  },
  {
    term: "图像分割",
    tag: "图像任务",
    short: "给图像里的每个像素分配类别。",
    detail: "它不是给整张图只下一个结论，而是细到图上每一个位置都要判断是什么。",
    example: "把遥感图像中的沟蚀区、植被、水体逐像素区分开。",
  },
  {
    term: "异常检测",
    tag: "核心任务",
    short: "先学什么叫正常，再找特别不正常的样本。",
    detail: "当异常样本很少、很难标注时，异常检测往往比直接分类更实用。",
    example: "反欺诈、设备故障预警、网络入侵检测。",
  },
  {
    term: "分类边界",
    tag: "分类术语",
    short: "模型心里那条“从这边算 A、从那边算 B”的分界线。",
    detail: "二维图里看起来像一条线或一片弯曲边界；高维空间里它本质上也是一种分割面。",
    example: "分类游乐场里背景颜色变化的位置，就是边界在起作用。",
  },
  {
    term: "kNN",
    tag: "分类术语",
    short: "看最近邻居怎么投票，再决定新点属于哪类。",
    detail: "kNN 的全名是 k-Nearest Neighbors，直觉很强，但数据一多会变慢。",
    example: "一个新点附近 3 个邻居里有 2 个是蓝色类，它就大概率判成蓝色类。",
  },
  {
    term: "k 值",
    tag: "分类术语",
    short: "kNN 里要参考多少个最近邻居。",
    detail: "k 太小容易受个别噪声影响，k 太大又会把局部细节抹平。",
    example: "k=1 很灵敏，k=9 更平滑。",
  },
  {
    term: "线性分类器",
    tag: "分类术语",
    short: "尝试用一条直线或一个平面把不同类别分开。",
    detail: "它假设类别之间能被线性边界大致切开，所以速度快、解释性强。",
    example: "二维图里常表现为一条直线边界。",
  },
  {
    term: "逻辑回归",
    tag: "分类术语",
    short: "名字里有回归，但它常用来做分类。",
    detail: "它通常输出一个概率，再根据概率把样本判成某一类，是分类入门里非常经典的模型。",
    example: "预测一封邮件是垃圾邮件的概率。",
  },
  {
    term: "决策树",
    tag: "树模型",
    short: "像不断做选择题一样，一层层把数据分开。",
    detail: "它可解释性强，因为你能直接看到模型按什么条件分裂数据。",
    example: "先问面积大不大，再问楼龄老不老，最后给出房价区间或类别判断。",
  },
  {
    term: "随机森林",
    tag: "树模型",
    short: "很多棵树一起做决定，比单棵树更稳。",
    detail: "它通过集成多棵决策树来降低单棵树过拟合的问题。",
    example: "很多棵树一起投票，决定某个样本最终属于哪类。",
  },
  {
    term: "梯度提升树",
    tag: "树模型",
    short: "一棵树接一棵树地修正之前的错误。",
    detail: "这是表格数据里很强的一类模型，很多工业任务和竞赛里都会用。",
    example: "XGBoost、LightGBM、CatBoost 都属于这一类。",
  },
  {
    term: "支持向量机 SVM",
    tag: "分类术语",
    short: "努力找到分界间隔最大的分类模型。",
    detail: "它很看重边界与样本之间的距离，适合中小规模、特征比较规整的数据。",
    example: "在二维图上尽量找到一条离两边样本都更远的分界线。",
  },
  {
    term: "朴素贝叶斯",
    tag: "概率模型",
    short: "根据条件概率快速判断类别。",
    detail: "它假设特征之间相对独立，虽然假设很朴素，但在一些文本任务里很有效。",
    example: "根据词语出现情况判断一段文本是不是垃圾信息。",
  },
  {
    term: "置信度",
    tag: "分类术语",
    short: "模型觉得自己这次判断有多把握。",
    detail: "高置信度不代表一定正确，只表示模型在当前规则下更偏向某个答案。",
    example: "一个点离蓝色样本堆很近，模型通常会给出更高置信度。",
  },
  {
    term: "参数",
    tag: "训练术语",
    short: "模型内部会被学习和更新的数值。",
    detail: "训练的过程，本质上就是不断调整这些参数，让模型输出更接近真实答案。",
    example: "回归里的 w 和 b 就是参数。",
  },
  {
    term: "斜率 w",
    tag: "回归术语",
    short: "表示 x 每增加一点，y 大概会变化多少。",
    detail: "斜率决定直线倾斜程度，是回归模型里最直观的参数之一。",
    example: "w=3 表示 x 每增加 1，预测的 y 大概增加 3。",
  },
  {
    term: "截距 b",
    tag: "回归术语",
    short: "表示直线在纵轴上的起点高度。",
    detail: "如果把 x 看成 0，b 就是模型此时给出的基础输出。",
    example: "在公式 y = wx + b 里，b 决定整体往上还是往下平移。",
  },
  {
    term: "损失 Loss",
    tag: "训练术语",
    short: "模型当前错得有多厉害的量化指标。",
    detail: "Loss 越大说明模型预测和真实值差得越远，训练目标通常就是让它越来越小。",
    example: "回归实验室里 Loss 下降，说明橙线更贴近蓝点了。",
  },
  {
    term: "梯度下降",
    tag: "训练术语",
    short: "顺着“让 Loss 下降最快的方向”去调整参数。",
    detail: "它不是一次跳到答案，而是反复走小步，逐渐接近更好的参数组合。",
    example: "每点一次“训练一步”，其实就是做了一轮梯度下降更新。",
  },
  {
    term: "学习率",
    tag: "训练术语",
    short: "每次更新参数时走多大一步。",
    detail: "学习率太小会学得慢，太大可能震荡甚至学崩。",
    example: "学习率从 0.04 提高到 0.2，训练可能会更快，也可能开始乱跳。",
  },
  {
    term: "噪声",
    tag: "数据术语",
    short: "数据里那些不稳定、带随机性的扰动。",
    detail: "真实世界数据几乎都有噪声，所以模型不可能每次都完美贴合。",
    example: "同样面积的房子，因为装修和时机不同，价格也会浮动，这种浮动就像噪声。",
  },
  {
    term: "K-Means",
    tag: "聚类术语",
    short: "一种经典聚类方法：先分组，再更新中心，不断循环。",
    detail: "它通过最小化组内距离，让同一簇里的样本尽量彼此接近。",
    example: "聚类雷达站里你看到的就是 K-Means 的简化过程。",
  },
  {
    term: "DBSCAN",
    tag: "聚类术语",
    short: "按密度找簇的聚类方法。",
    detail: "它不要求每个簇都像圆形，也更容易把稀疏的离群点识别出来。",
    example: "如果你的数据是一条弯曲带状分布，DBSCAN 往往比 K-Means 更合适。",
  },
  {
    term: "PCA",
    tag: "降维术语",
    short: "把高维信息压缩到更低维，同时尽量保留主要变化方向。",
    detail: "常用于可视化、降噪和预处理，让复杂数据先变得更容易看。",
    example: "把几十维特征压成二维，方便画图看整体结构。",
  },
  {
    term: "中心点 centroid",
    tag: "聚类术语",
    short: "某一簇样本的代表位置。",
    detail: "K-Means 里，每轮都会把中心点移动到这一组样本的平均位置。",
    example: "图中那个彩色叉号就是 centroid。",
  },
  {
    term: "收敛",
    tag: "聚类术语",
    short: "模型继续迭代也几乎不再变化的状态。",
    detail: "收敛不一定代表最优，只表示当前算法基本稳定下来了。",
    example: "当中心点几乎不再移动时，我们说这轮聚类收敛了。",
  },
  {
    term: "语义分割",
    tag: "图像术语",
    short: "让每个像素都知道自己属于哪种语义类别。",
    detail: "它常用于医学影像、遥感、自动驾驶等需要精细定位的任务。",
    example: "把一张遥感图里的道路、植被、水体、裸地全部分开。",
  },
  {
    term: "U-Net",
    tag: "图像术语",
    short: "一种非常常见的图像分割网络结构。",
    detail: "它擅长把整体语义和局部细节结合起来，所以在医学和遥感分割里很常见。",
    example: "你的仓库以后做沟蚀区分割时，就很可能会继续用到 U-Net。",
  },
  {
    term: "CNN",
    tag: "深度学习",
    short: "卷积神经网络，擅长处理图像和栅格。",
    detail: "它会自动学习局部纹理、边缘和空间结构，是图像任务的重要基础模型。",
    example: "图像分类、遥感场景识别经常用到 CNN。",
  },
  {
    term: "Transformer",
    tag: "深度学习",
    short: "依靠注意力机制建模关系的大模型基础结构。",
    detail: "它最早在自然语言处理中大火，后来也广泛进入视觉和多模态任务。",
    example: "现在很多大语言模型和多模态模型都基于 Transformer。",
  },
  {
    term: "MLP",
    tag: "深度学习",
    short: "最基础的全连接神经网络。",
    detail: "它由多层神经元堆叠而成，适合讲神经网络最基本的计算方式。",
    example: "表格特征输入一个多层感知机，输出分类结果或回归值。",
  },
  {
    term: "RNN / LSTM / GRU",
    tag: "序列模型",
    short: "专门处理顺序信息的一类模型。",
    detail: "它们适合文本、语音、时间序列等场景，强调“前后顺序会影响结果”。",
    example: "根据前几天的观测值预测下一天趋势。",
  },
  {
    term: "自编码器",
    tag: "表示学习",
    short: "先压缩再还原，逼模型学会更有用的内部表示。",
    detail: "它常用于降维、去噪、异常检测，是理解表示学习的好入口。",
    example: "模型把图像压缩成短向量，再尽量把原图重建回来。",
  },
  {
    term: "GAN",
    tag: "生成模型",
    short: "生成器和判别器对抗训练的一类模型。",
    detail: "一个负责生成，一个负责挑错，双方对抗中提升生成质量。",
    example: "生成更逼真的人脸、纹理或图像风格。",
  },
  {
    term: "推荐系统",
    tag: "应用术语",
    short: "根据用户和内容信息，决定该把什么推荐给谁。",
    detail: "推荐系统通常不是单一模型，而是一套召回、排序、重排的组合流程。",
    example: "短视频、商品、新闻推荐都属于推荐系统。",
  },
  {
    term: "召回",
    tag: "应用术语",
    short: "先从海量候选里快速捞出一小批可能相关的内容。",
    detail: "召回阶段重速度和覆盖面，目的是别把真正感兴趣的内容漏掉。",
    example: "先从几百万商品里挑出几百个可能适合你的，再交给后续排序。",
  },
  {
    term: "排序",
    tag: "应用术语",
    short: "对候选结果按“你大概率最想看哪个”重新排位。",
    detail: "排序通常比召回更精细，因为这一步直接决定最后展示顺序。",
    example: "两个都可能适合你的商品，排序模型会决定谁排在前面。",
  },
  {
    term: "相似度学习",
    tag: "应用术语",
    short: "让模型学会判断两个对象像不像。",
    detail: "它常用于推荐、检索、人脸识别等任务，本质上是在学一种更有用的距离。",
    example: "用户 A 和用户 B 兴趣接近，系统就可能把相似内容推荐给他们。",
  },
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function sigmoid(value) {
  return 1 / (1 + Math.exp(-value));
}

function randomNormal() {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function renderBlocks(targetId, blocks) {
  const target = document.getElementById(targetId);
  target.innerHTML = blocks
    .map(
      (block) => `
        <div class="explain-block">
          <h4>${block.title}</h4>
          ${block.html}
        </div>
      `
    )
    .join("");
}

function drawAxes(ctx, canvas, bounds, labels) {
  const { pad, xMin, xMax, yMin, yMax } = bounds;
  ctx.save();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = palette.grid;
  ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i += 1) {
    const x = pad + ((canvas.width - pad * 2) / 5) * i;
    const y = pad + ((canvas.height - pad * 2) / 5) * i;
    ctx.beginPath();
    ctx.moveTo(x, pad);
    ctx.lineTo(x, canvas.height - pad);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(canvas.width - pad, y);
    ctx.stroke();
  }

  ctx.strokeStyle = "rgba(34, 48, 71, 0.38)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, canvas.height - pad);
  ctx.lineTo(canvas.width - pad, canvas.height - pad);
  ctx.stroke();

  ctx.fillStyle = palette.soft;
  ctx.font = "13px Trebuchet MS";
  ctx.fillText(labels.x, canvas.width - pad - 44, canvas.height - pad + 28);
  ctx.save();
  ctx.translate(pad - 28, pad + 12);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText(labels.y, 0, 0);
  ctx.restore();

  for (let i = 0; i <= 5; i += 1) {
    const xValue = xMin + ((xMax - xMin) / 5) * i;
    const yValue = yMin + ((yMax - yMin) / 5) * i;
    const x = pad + ((canvas.width - pad * 2) / 5) * i;
    const y = canvas.height - pad - ((canvas.height - pad * 2) / 5) * i;
    ctx.fillStyle = palette.soft;
    ctx.fillText(xValue.toFixed(1), x - 10, canvas.height - pad + 16);
    if (i < 5) {
      ctx.fillText(yValue.toFixed(1), pad - 30, y + 4);
    }
  }
  ctx.restore();
}

function toCanvasPoint(canvas, bounds, point) {
  const { pad, xMin, xMax, yMin, yMax } = bounds;
  const x = pad + ((point.x - xMin) / (xMax - xMin)) * (canvas.width - pad * 2);
  const y =
    canvas.height -
    pad -
    ((point.y - yMin) / (yMax - yMin)) * (canvas.height - pad * 2);
  return { x, y };
}

function fromCanvasPoint(canvas, bounds, px, py) {
  const { pad, xMin, xMax, yMin, yMax } = bounds;
  const x = xMin + ((px - pad) / (canvas.width - pad * 2)) * (xMax - xMin);
  const y = yMin + ((canvas.height - pad - py) / (canvas.height - pad * 2)) * (yMax - yMin);
  return {
    x: clamp(x, xMin, xMax),
    y: clamp(y, yMin, yMax),
  };
}

function formatPoint(point) {
  return `(${point.x.toFixed(1)}, ${point.y.toFixed(1)})`;
}

function generateClassificationSample() {
  const points = [];
  const clusterA = [
    [2.1, 7.8],
    [2.4, 6.8],
    [3.2, 7.1],
    [2.7, 8.5],
    [1.8, 6.9],
    [3.7, 6.3],
  ];
  const clusterB = [
    [7.4, 2.6],
    [6.4, 3.2],
    [7.9, 4.1],
    [6.8, 1.7],
    [8.4, 2.8],
    [5.9, 3.7],
  ];
  clusterA.forEach(([x, y]) => points.push({ x, y, label: "A" }));
  clusterB.forEach(([x, y]) => points.push({ x, y, label: "B" }));
  classificationState.points = points;
  classificationState.query = null;
  recomputeClassificationModel();
  drawClassification();
  updateClassificationExplain();
}

function normalizeClassPoint(point) {
  return {
    x: (point.x - 5) / 5,
    y: (point.y - 5) / 5,
  };
}

function trainLinearClassifier(points) {
  if (points.length < 4) return null;
  let w1 = 0;
  let w2 = 0;
  let b = 0;
  const learningRate = 0.35;

  for (let epoch = 0; epoch < 500; epoch += 1) {
    let dw1 = 0;
    let dw2 = 0;
    let db = 0;
    points.forEach((point) => {
      const norm = normalizeClassPoint(point);
      const target = point.label === "B" ? 1 : 0;
      const pred = sigmoid(w1 * norm.x + w2 * norm.y + b);
      const diff = pred - target;
      dw1 += diff * norm.x;
      dw2 += diff * norm.y;
      db += diff;
    });
    const scale = 1 / points.length;
    w1 -= learningRate * dw1 * scale;
    w2 -= learningRate * dw2 * scale;
    b -= learningRate * db * scale;
  }

  return { w1, w2, b };
}

function recomputeClassificationModel() {
  classificationState.linearModel =
    classificationState.model === "linear"
      ? trainLinearClassifier(classificationState.points)
      : null;
}

function predictKNN(point) {
  if (classificationState.points.length === 0) return null;
  const sorted = [...classificationState.points]
    .map((sample) => ({
      sample,
      dist: distance(point, sample),
    }))
    .sort((a, b) => a.dist - b.dist)
    .slice(0, Math.min(classificationState.k, classificationState.points.length));

  const votes = sorted.reduce(
    (acc, item) => {
      acc[item.sample.label] += 1;
      return acc;
    },
    { A: 0, B: 0 }
  );
  const label = votes.B > votes.A ? "B" : "A";
  const confidence = Math.max(votes.A, votes.B) / sorted.length;
  return { label, confidence, neighbors: sorted };
}

function predictLinear(point) {
  const model = classificationState.linearModel;
  if (!model) return null;
  const norm = normalizeClassPoint(point);
  const score = sigmoid(model.w1 * norm.x + model.w2 * norm.y + model.b);
  return {
    label: score >= 0.5 ? "B" : "A",
    confidence: score >= 0.5 ? score : 1 - score,
    score,
  };
}

function predictClassification(point) {
  if (classificationState.model === "linear") {
    return predictLinear(point);
  }
  return predictKNN(point);
}

function drawClassification() {
  const canvas = document.getElementById("classificationCanvas");
  const ctx = canvas.getContext("2d");
  const bounds = { xMin: 0, xMax: 10, yMin: 0, yMax: 10, pad: 44 };

  drawAxes(ctx, canvas, bounds, { x: "特征 1", y: "特征 2" });

  const cellSize = 18;
  for (let px = bounds.pad; px < canvas.width - bounds.pad; px += cellSize) {
    for (let py = bounds.pad; py < canvas.height - bounds.pad; py += cellSize) {
      const point = fromCanvasPoint(canvas, bounds, px + cellSize / 2, py + cellSize / 2);
      const prediction = predictClassification(point);
      if (!prediction) continue;
      ctx.fillStyle =
        prediction.label === "A" ? palette.blueFill : palette.orangeFill;
      ctx.fillRect(px, py, cellSize, cellSize);
    }
  }

  if (classificationState.model === "linear" && classificationState.linearModel) {
    const model = classificationState.linearModel;
    const boundaryY = (x) => {
      if (Math.abs(model.w2) < 1e-6) return null;
      const xn = (x - 5) / 5;
      const yn = -(model.w1 * xn + model.b) / model.w2;
      return yn * 5 + 5;
    };
    const visible = [
      { x: 0, y: boundaryY(0) },
      { x: 10, y: boundaryY(10) },
    ].filter((point) => point.y !== null && point.y >= 0 && point.y <= 10);
    if (visible.length === 2) {
      const start = toCanvasPoint(canvas, bounds, visible[0]);
      const end = toCanvasPoint(canvas, bounds, visible[1]);
      ctx.strokeStyle = palette.rose;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
  }

  classificationState.points.forEach((point) => {
    const mapped = toCanvasPoint(canvas, bounds, point);
    ctx.beginPath();
    ctx.fillStyle = point.label === "A" ? palette.blue : palette.orange;
    ctx.arc(mapped.x, mapped.y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
  });

  if (classificationState.query) {
    const mapped = toCanvasPoint(canvas, bounds, classificationState.query);
    const prediction = predictClassification(classificationState.query);
    ctx.beginPath();
    ctx.fillStyle = palette.rose;
    ctx.arc(mapped.x, mapped.y, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    if (prediction) {
      ctx.fillStyle = palette.text;
      ctx.font = "bold 14px Trebuchet MS";
      ctx.fillText(
        `预测：${prediction.label === "A" ? "蓝色类" : "橙色类"}`,
        mapped.x + 12,
        mapped.y - 12
      );
    }
  }
}

function updateClassificationExplain() {
  const countA = classificationState.points.filter((point) => point.label === "A").length;
  const countB = classificationState.points.filter((point) => point.label === "B").length;
  const query = classificationState.query
    ? predictClassification(classificationState.query)
    : null;
  const blocks = [];

  blocks.push({
    title: "偷懒版一句话",
    html: `<p>分类就是：先给模型看一些“这是什么类、那是什么类”的样本，再让它猜新样本属于哪一类。</p>`,
  });

  blocks.push({
    title: "你现在看到的是什么",
    html: `
      <ul>
        <li>蓝色点和橙色点是你喂给模型的已知样本。</li>
        <li>背景浅色区域代表模型认为“这片地方更像哪一类”。</li>
        <li>当前数据量：蓝色类 ${countA} 个，橙色类 ${countB} 个。</li>
        <li>当前模型：<span class="inline-pill">${classificationState.model === "knn" ? "k 近邻 kNN" : "线性分类器"}</span></li>
      </ul>
    `,
  });

  if (classificationState.model === "knn") {
    blocks.push({
      title: "kNN 原理",
      html: `
        <p>kNN 不会先学出一个复杂公式，它更像“看邻居投票”。一个新点来了，它先找离自己最近的 ${classificationState.k} 个样本，再看哪一类人数更多。</p>
        <ul>
          <li><strong>优点：</strong>直观、适合入门。</li>
          <li><strong>缺点：</strong>数据一多就会变慢，而且对尺度和噪声比较敏感。</li>
          <li><strong>为什么边界会弯弯曲曲：</strong>因为它跟着局部邻居走，不一定是一条直线。</li>
        </ul>
      `,
    });
  } else {
    blocks.push({
      title: "线性分类器原理",
      html: `
        <p>线性分类器会努力找到一条线，把两类点尽量分开。你可以把它想象成“在平面上拿一把直尺找最佳切分位置”。</p>
        <ul>
          <li><strong>优点：</strong>训练快、可解释性强。</li>
          <li><strong>缺点：</strong>如果真实边界很弯，它就不够灵活。</li>
          <li><strong>玫瑰色直线：</strong>就是模型当前学到的分界线。</li>
        </ul>
      `,
    });
  }

  if (query && classificationState.query) {
    blocks.push({
      title: "当前预测点解读",
      html: `
        <ul>
          <li>你点的位置：${formatPoint(classificationState.query)}</li>
          <li>模型判断：<span class="${
            query.label === "A" ? "good" : "warn"
          }">${query.label === "A" ? "蓝色类" : "橙色类"}</span></li>
          <li>置信感：${(query.confidence * 100).toFixed(1)}%</li>
          <li>这不是“真理”，只是模型根据已有样本得出的当前判断。</li>
        </ul>
      `,
    });
  }

  blocks.push({
    title: "现实里怎么用",
    html: `
      <ul>
        <li>垃圾邮件过滤：把邮件分成垃圾或正常。</li>
        <li>病理辅助诊断：把样本分成阳性或阴性。</li>
        <li>土地覆盖识别：先做整图分类，再进阶到像素级分割。</li>
      </ul>
    `,
  });

  renderBlocks("classificationExplain", blocks);
}

function generateRegressionData() {
  regressionState.points = Array.from({ length: 14 }, (_, index) => {
    const x = 0.6 + index * 0.35;
    const y = 4.8 + 3.15 * x + randomNormal() * regressionState.noise;
    return { x, y };
  });
  resetRegressionModel(false);
}

function computeRegressionLoss() {
  if (regressionState.points.length === 0) return 0;
  const total = regressionState.points.reduce((sum, point) => {
    const pred = regressionState.w * point.x + regressionState.b;
    const diff = pred - point.y;
    return sum + diff * diff;
  }, 0);
  return total / regressionState.points.length;
}

function resetRegressionModel(redraw = true) {
  regressionState.w = 0;
  regressionState.b = 0;
  regressionState.step = 0;
  regressionState.lossHistory = [computeRegressionLoss()];
  stopRegressionAuto();
  if (redraw) {
    drawRegression();
    updateRegressionExplain();
  }
}

function regressionStep() {
  if (regressionState.points.length === 0) return;
  const n = regressionState.points.length;
  let dw = 0;
  let db = 0;
  regressionState.points.forEach((point) => {
    const pred = regressionState.w * point.x + regressionState.b;
    const diff = pred - point.y;
    dw += 2 * diff * point.x;
    db += 2 * diff;
  });
  dw /= n;
  db /= n;
  regressionState.w -= regressionState.learningRate * dw;
  regressionState.b -= regressionState.learningRate * db;
  regressionState.step += 1;
  regressionState.lossHistory.push(computeRegressionLoss());
  drawRegression();
  updateRegressionExplain();
}

function stopRegressionAuto() {
  if (regressionState.autoTimer) {
    clearInterval(regressionState.autoTimer);
    regressionState.autoTimer = null;
    document.getElementById("regressionAutoBtn").textContent = "自动训练";
  }
}

function toggleRegressionAuto() {
  if (regressionState.autoTimer) {
    stopRegressionAuto();
    return;
  }
  regressionState.autoTimer = setInterval(() => {
    regressionStep();
    const history = regressionState.lossHistory;
    if (history.length > 8) {
      const delta = Math.abs(history[history.length - 1] - history[history.length - 2]);
      if (delta < 0.0005 || regressionState.step > 180) {
        stopRegressionAuto();
      }
    }
  }, 180);
  document.getElementById("regressionAutoBtn").textContent = "停止训练";
}

function drawRegression() {
  const canvas = document.getElementById("regressionCanvas");
  const ctx = canvas.getContext("2d");
  const maxY =
    regressionState.points.length > 0
      ? Math.max(...regressionState.points.map((point) => point.y)) + 2
      : 24;
  const bounds = { xMin: 0, xMax: 6, yMin: 0, yMax: maxY, pad: 48 };

  drawAxes(ctx, canvas, bounds, { x: "特征 x", y: "目标 y" });

  regressionState.points.forEach((point) => {
    const mapped = toCanvasPoint(canvas, bounds, point);
    ctx.beginPath();
    ctx.arc(mapped.x, mapped.y, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = palette.blue;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
  });

  const lineStart = { x: bounds.xMin, y: regressionState.w * bounds.xMin + regressionState.b };
  const lineEnd = { x: bounds.xMax, y: regressionState.w * bounds.xMax + regressionState.b };
  const start = toCanvasPoint(canvas, bounds, lineStart);
  const end = toCanvasPoint(canvas, bounds, lineEnd);
  ctx.strokeStyle = palette.orange;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.stroke();

  regressionState.points.forEach((point) => {
    const predicted = {
      x: point.x,
      y: regressionState.w * point.x + regressionState.b,
    };
    const a = toCanvasPoint(canvas, bounds, point);
    const b = toCanvasPoint(canvas, bounds, predicted);
    ctx.strokeStyle = "rgba(198, 91, 117, 0.3)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  });

  document.getElementById("weightValue").textContent = regressionState.w.toFixed(2);
  document.getElementById("biasValue").textContent = regressionState.b.toFixed(2);
  document.getElementById("lossValue").textContent = computeRegressionLoss().toFixed(3);
}

function updateRegressionExplain() {
  const currentLoss = computeRegressionLoss();
  const history = regressionState.lossHistory;
  const trend =
    history.length < 2
      ? "还没开始训练"
      : history[history.length - 1] < history[history.length - 2]
      ? "Loss 在下降，说明直线正在逼近规律。"
      : "Loss 没有下降，说明学习率可能偏大，或者数据比较嘈杂。";

  renderBlocks("regressionExplain", [
    {
      title: "偷懒版一句话",
      html: `<p>回归就是：模型不再回答“是哪一类”，而是回答“具体是多少”。</p>`,
    },
    {
      title: "你现在看到的是什么",
      html: `
        <ul>
          <li>蓝点是真实样本。</li>
          <li>橙线是模型当前画出的预测线。</li>
          <li>玫瑰色竖线是每个点的误差，也就是“预测值和真实值差了多少”。</li>
          <li>当前训练步数：${regressionState.step} 步。</li>
        </ul>
      `,
    },
    {
      title: "梯度下降原理",
      html: `
        <p>梯度下降的核心就是反复问一句话：如果我把当前直线稍微往这个方向挪一点，误差会不会更小？</p>
        <ul>
          <li>参数 <strong>w</strong> 决定斜率，表示 x 每增加一点，y 大概增加多少。</li>
          <li>参数 <strong>b</strong> 决定截距，表示直线起点高度。</li>
          <li>Loss = ${currentLoss.toFixed(3)}，越小越好。</li>
          <li>${trend}</li>
        </ul>
      `,
    },
    {
      title: "学习率为什么重要",
      html: `
        <ul>
          <li>当前学习率：${regressionState.learningRate.toFixed(2)}</li>
          <li>太小：每次只挪一点点，学得很慢。</li>
          <li>太大：可能一下跨过最佳位置，来回震荡。</li>
          <li>你可以拉动滑块感受这件事。</li>
        </ul>
      `,
    },
    {
      title: "现实里怎么用",
      html: `
        <ul>
          <li>房价预测、销量预测、温度预测、作物产量估计，都是回归思路。</li>
          <li>在遥感里，也会用回归去估计土壤湿度、地表温度、生物量等连续指标。</li>
        </ul>
      `,
    },
  ]);
}

function generateClusterCenters(k) {
  const presets = {
    2: [
      { x: 3.0, y: 7.3 },
      { x: 7.0, y: 3.0 },
    ],
    3: [
      { x: 2.4, y: 7.6 },
      { x: 7.4, y: 6.8 },
      { x: 5.6, y: 2.5 },
    ],
    4: [
      { x: 2.3, y: 7.4 },
      { x: 7.5, y: 7.0 },
      { x: 3.1, y: 3.0 },
      { x: 7.1, y: 2.5 },
    ],
  };
  return presets[k];
}

function generateClusteringData() {
  const centers = generateClusterCenters(clusteringState.k);
  const points = [];
  centers.forEach((center) => {
    for (let i = 0; i < 16; i += 1) {
      points.push({
        x: clamp(center.x + randomNormal() * 0.55, 0.6, 9.4),
        y: clamp(center.y + randomNormal() * 0.55, 0.6, 9.4),
      });
    }
  });
  clusteringState.points = points;
  clusteringState.centroids = [];
  clusteringState.assignments = [];
  clusteringState.phase = "assign";
  clusteringState.iteration = 0;
  clusteringState.stable = false;
  clusteringState.lastShift = null;
  stopClusterAuto();
  drawClustering();
  updateClusteringExplain();
}

function initCentroids() {
  if (clusteringState.points.length === 0) return;
  const sample = shuffle(clusteringState.points).slice(0, clusteringState.k);
  clusteringState.centroids = sample.map((point) => ({ x: point.x, y: point.y }));
  clusteringState.assignments = new Array(clusteringState.points.length).fill(0);
  clusteringState.phase = "assign";
  clusteringState.iteration = 0;
  clusteringState.stable = false;
  clusteringState.lastShift = null;
  drawClustering();
  updateClusteringExplain();
}

function assignClusters() {
  if (clusteringState.centroids.length === 0) return;
  clusteringState.assignments = clusteringState.points.map((point) => {
    let bestIndex = 0;
    let bestDistance = Infinity;
    clusteringState.centroids.forEach((centroid, index) => {
      const dist = distance(point, centroid);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestIndex = index;
      }
    });
    return bestIndex;
  });
}

function updateCentroids() {
  if (clusteringState.centroids.length === 0) return;
  const next = clusteringState.centroids.map((centroid, index) => {
    const members = clusteringState.points.filter(
      (_, pointIndex) => clusteringState.assignments[pointIndex] === index
    );
    if (members.length === 0) return centroid;
    const sum = members.reduce(
      (acc, point) => {
        acc.x += point.x;
        acc.y += point.y;
        return acc;
      },
      { x: 0, y: 0 }
    );
    return { x: sum.x / members.length, y: sum.y / members.length };
  });

  const shift = next.reduce(
    (sum, centroid, index) => sum + distance(centroid, clusteringState.centroids[index]),
    0
  );
  clusteringState.centroids = next;
  clusteringState.lastShift = shift;
  clusteringState.iteration += 1;
  clusteringState.stable = shift < 0.08;
}

function clusterStep() {
  if (clusteringState.points.length === 0) return;
  if (clusteringState.centroids.length === 0) {
    initCentroids();
    return;
  }
  if (clusteringState.phase === "assign") {
    assignClusters();
    clusteringState.phase = "update";
  } else {
    updateCentroids();
    clusteringState.phase = "assign";
  }
  drawClustering();
  updateClusteringExplain();
}

function stopClusterAuto() {
  if (clusteringState.autoTimer) {
    clearInterval(clusteringState.autoTimer);
    clusteringState.autoTimer = null;
    document.getElementById("clusterAutoBtn").textContent = "自动迭代";
  }
}

function toggleClusterAuto() {
  if (clusteringState.autoTimer) {
    stopClusterAuto();
    return;
  }
  clusteringState.autoTimer = setInterval(() => {
    clusterStep();
    if (clusteringState.stable && clusteringState.phase === "assign") {
      stopClusterAuto();
    }
    if (clusteringState.iteration > 12) {
      stopClusterAuto();
    }
  }, 420);
  document.getElementById("clusterAutoBtn").textContent = "停止迭代";
}

function drawClustering() {
  const canvas = document.getElementById("clusteringCanvas");
  const ctx = canvas.getContext("2d");
  const bounds = { xMin: 0, xMax: 10, yMin: 0, yMax: 10, pad: 44 };
  drawAxes(ctx, canvas, bounds, { x: "特征 1", y: "特征 2" });

  if (clusteringState.centroids.length > 0) {
    const cellSize = 24;
    for (let px = bounds.pad; px < canvas.width - bounds.pad; px += cellSize) {
      for (let py = bounds.pad; py < canvas.height - bounds.pad; py += cellSize) {
        const point = fromCanvasPoint(canvas, bounds, px + cellSize / 2, py + cellSize / 2);
        let best = 0;
        let bestDistance = Infinity;
        clusteringState.centroids.forEach((centroid, index) => {
          const dist = distance(point, centroid);
          if (dist < bestDistance) {
            bestDistance = dist;
            best = index;
          }
        });
        ctx.fillStyle = palette.clusterFill[best];
        ctx.fillRect(px, py, cellSize, cellSize);
      }
    }
  }

  clusteringState.points.forEach((point, index) => {
    const mapped = toCanvasPoint(canvas, bounds, point);
    const clusterIndex = clusteringState.assignments[index];
    const color =
      clusteringState.centroids.length > 0
        ? palette.cluster[clusterIndex ?? 0]
        : palette.blue;
    ctx.beginPath();
    ctx.arc(mapped.x, mapped.y, 6.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
  });

  clusteringState.centroids.forEach((centroid, index) => {
    const mapped = toCanvasPoint(canvas, bounds, centroid);
    ctx.strokeStyle = palette.cluster[index];
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(mapped.x - 10, mapped.y);
    ctx.lineTo(mapped.x + 10, mapped.y);
    ctx.moveTo(mapped.x, mapped.y - 10);
    ctx.lineTo(mapped.x, mapped.y + 10);
    ctx.stroke();
  });
}

function updateClusteringExplain() {
  const clusterCounts = new Array(clusteringState.k).fill(0);
  clusteringState.assignments.forEach((assignment) => {
    if (clusterCounts[assignment] !== undefined) {
      clusterCounts[assignment] += 1;
    }
  });

  renderBlocks("clusteringExplain", [
    {
      title: "偷懒版一句话",
      html: `<p>聚类就是：先不告诉模型正确答案，只让它自己把“彼此很像”的点抱成几团。</p>`,
    },
    {
      title: "你现在看到的是什么",
      html: `
        <ul>
          <li>每个彩色点是一个样本，但一开始它们没有标签。</li>
          <li>彩色叉号是每一类的中心点，也叫 centroid。</li>
          <li>当前 K 值：${clusteringState.k}，表示你想分成 ${clusteringState.k} 组。</li>
          <li>当前阶段：<span class="inline-pill">${
            clusteringState.phase === "assign" ? "下一步会分配样本" : "下一步会更新中心"
          }</span></li>
        </ul>
      `,
    },
    {
      title: "K-Means 两步循环",
      html: `
        <ul>
          <li><strong>第 1 步，分配：</strong>每个点找离自己最近的中心，先站队。</li>
          <li><strong>第 2 步，更新：</strong>每个中心移动到本组样本的平均位置。</li>
          <li><strong>重复：</strong>一直重复，直到中心几乎不动为止。</li>
          <li>当前已经完成 ${clusteringState.iteration} 轮中心更新。</li>
        </ul>
      `,
    },
    {
      title: "当前状态解读",
      html: `
        <ul>
          <li>各簇样本数量：${clusterCounts.map((count, index) => `簇 ${index + 1}: ${count}`).join("，")}</li>
          <li>中心移动量：${
            clusteringState.lastShift === null ? "还没更新中心" : clusteringState.lastShift.toFixed(3)
          }</li>
          <li>${
            clusteringState.stable
              ? '<span class="good">中心已经基本稳定，说明这轮聚类差不多收敛了。</span>'
              : '<span class="warn">中心还在移动，说明模型还在调整分组。</span>'
          }</li>
        </ul>
      `,
    },
    {
      title: "现实里怎么用",
      html: `
        <ul>
          <li>电商用户分群、城市功能区分析、遥感地物粗分组都常用聚类。</li>
          <li>要注意：聚类不是“真相标签”，而是按相似性分组，所以结果需要业务解释。</li>
        </ul>
      `,
    },
  ]);
}

function renderApplicationCards() {
  const container = document.getElementById("applicationCards");
  container.innerHTML = applicationCards
    .map(
      (card) => `
        <article class="app-card">
          <span class="app-tag">${card.task}</span>
          <h3>${card.title}</h3>
          <p>${card.description}</p>
          <p><strong>为什么是它：</strong>${card.why}</p>
        </article>
      `
    )
    .join("");
}

function renderModelCards() {
  const container = document.getElementById("modelCards");
  if (!container) return;
  container.innerHTML = modelCards
    .map(
      (item) => `
        <article class="glossary-card">
          <span class="app-tag">${item.family}</span>
          <h3>${item.name}</h3>
          <p><strong>它是干什么的：</strong>${item.use}</p>
          <p><strong>什么时候适合看它：</strong>${item.fit}</p>
        </article>
      `
    )
    .join("");
}

function renderGlossary() {
  const container = document.getElementById("glossaryCards");
  if (!container) return;
  container.innerHTML = glossaryItems
    .map(
      (item) => `
        <article class="glossary-card">
          <span class="app-tag">${item.tag}</span>
          <h3>${item.term}</h3>
          <p><strong>一句话：</strong>${item.short}</p>
          <p><strong>展开讲：</strong>${item.detail}</p>
          <p><strong>例子：</strong>${item.example}</p>
        </article>
      `
    )
    .join("");
}

function renderQuiz() {
  const current = quizQuestions[quizState.index];
  document.getElementById("quizQuestion").textContent = current.question;
  const optionsBox = document.getElementById("quizOptions");
  optionsBox.innerHTML = current.options
    .map(
      (option) => `
        <button class="quiz-option ${
          quizState.selected === option ? "selected" : ""
        }" data-option="${option}">
          ${option}
        </button>
      `
    )
    .join("");

  optionsBox.querySelectorAll(".quiz-option").forEach((button) => {
    button.addEventListener("click", () => {
      quizState.selected = button.dataset.option;
      renderQuiz();
    });
  });

  if (!quizState.answered) {
    renderBlocks("quizExplain", [
      {
        title: "还没提交",
        html: "<p>先选一个答案，再点“提交答案”。别怕错，错了才更容易记住。</p>",
      },
    ]);
    return;
  }

  const correct = quizState.selected === current.answer;
  renderBlocks("quizExplain", [
    {
      title: correct ? "答对了" : "这题答错了",
      html: `
        <ul>
          <li>你的答案：${quizState.selected || "未选择"}</li>
          <li>正确答案：<span class="${correct ? "good" : "warn"}">${current.answer}</span></li>
          <li>${current.explanation}</li>
        </ul>
      `,
    },
    {
      title: "偷懒记忆法",
      html: `
        <ul>
          <li>问“属于哪一类” usually 是分类。</li>
          <li>问“具体是多少” usually 是回归。</li>
          <li>问“没有标签先分群” usually 是聚类。</li>
          <li>问“图上每个像素是什么” usually 是分割。</li>
        </ul>
      `,
    },
  ]);
}

function submitQuiz() {
  if (!quizState.selected) {
    renderBlocks("quizExplain", [
      {
        title: "先选一个答案",
        html: "<p>机器学习可以试错，这个小游戏也一样。你先随便选一个，再看解析。</p>",
      },
    ]);
    return;
  }
  quizState.answered = true;
  renderQuiz();
}

function nextQuiz() {
  quizState.index = (quizState.index + 1) % quizQuestions.length;
  quizState.selected = null;
  quizState.answered = false;
  renderQuiz();
}

function bindTabs() {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
      button.classList.add("active");
      document.getElementById(button.dataset.tab).classList.add("active");
    });
  });
}

function bindClassification() {
  const canvas = document.getElementById("classificationCanvas");
  const bounds = { xMin: 0, xMax: 10, yMin: 0, yMax: 10, pad: 44 };
  document.getElementById("classTool").addEventListener("change", (event) => {
    classificationState.tool = event.target.value;
  });
  document.getElementById("classModel").addEventListener("change", (event) => {
    classificationState.model = event.target.value;
    recomputeClassificationModel();
    drawClassification();
    updateClassificationExplain();
  });
  document.getElementById("knnSlider").addEventListener("input", (event) => {
    classificationState.k = Number(event.target.value);
    document.getElementById("knnValue").textContent = String(classificationState.k);
    drawClassification();
    updateClassificationExplain();
  });
  document.getElementById("classSampleBtn").addEventListener("click", generateClassificationSample);
  document.getElementById("classClearBtn").addEventListener("click", () => {
    classificationState.points = [];
    classificationState.query = null;
    recomputeClassificationModel();
    drawClassification();
    updateClassificationExplain();
  });

  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const point = fromCanvasPoint(
      canvas,
      bounds,
      (x / rect.width) * canvas.width,
      (y / rect.height) * canvas.height
    );
    if (classificationState.tool === "inspect") {
      classificationState.query = point;
    } else {
      classificationState.points.push({ ...point, label: classificationState.tool });
      classificationState.query = null;
      recomputeClassificationModel();
    }
    drawClassification();
    updateClassificationExplain();
  });
}

function bindRegression() {
  document.getElementById("learningRateSlider").addEventListener("input", (event) => {
    regressionState.learningRate = Number(event.target.value) / 100;
    document.getElementById("learningRateValue").textContent =
      regressionState.learningRate.toFixed(2);
    updateRegressionExplain();
  });
  document.getElementById("noiseSlider").addEventListener("input", (event) => {
    regressionState.noise = Number(event.target.value) / 10;
    document.getElementById("noiseValue").textContent = regressionState.noise.toFixed(1);
  });
  document.getElementById("regressionSampleBtn").addEventListener("click", () => {
    generateRegressionData();
    drawRegression();
    updateRegressionExplain();
  });
  document.getElementById("regressionStepBtn").addEventListener("click", regressionStep);
  document.getElementById("regressionAutoBtn").addEventListener("click", toggleRegressionAuto);
  document.getElementById("regressionResetBtn").addEventListener("click", () => {
    resetRegressionModel();
  });
}

function bindClustering() {
  document.getElementById("clusterK").addEventListener("change", (event) => {
    clusteringState.k = Number(event.target.value);
    generateClusteringData();
  });
  document.getElementById("clusterSampleBtn").addEventListener("click", generateClusteringData);
  document.getElementById("clusterInitBtn").addEventListener("click", initCentroids);
  document.getElementById("clusterStepBtn").addEventListener("click", clusterStep);
  document.getElementById("clusterAutoBtn").addEventListener("click", toggleClusterAuto);
}

function bindQuiz() {
  document.getElementById("quizSubmitBtn").addEventListener("click", submitQuiz);
  document.getElementById("quizNextBtn").addEventListener("click", nextQuiz);
}

function init() {
  bindTabs();
  bindClassification();
  bindRegression();
  bindClustering();
  bindQuiz();
  renderModelCards();
  renderApplicationCards();
  renderGlossary();
  generateClassificationSample();
  generateRegressionData();
  drawRegression();
  updateRegressionExplain();
  generateClusteringData();
  renderQuiz();
}

document.addEventListener("DOMContentLoaded", init);
