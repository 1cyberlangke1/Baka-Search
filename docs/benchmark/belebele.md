# BakaSearch — Belebele 阅读理解检索

生成时间：2026-07-19 16:32:04 UTC

## 摘要

| 指标 | 数值 |
|------|------|
| 纯 BM25 nDCG@10 | **0.4811** |
| +桥扩展 nDCG@10 | **0.4754** |
| 差值 | **-0.0057** |
| 排行榜排名（纯 BM25） | **#51 / 89** |
| 排行榜排名（+桥扩展） | **#51 / 89** |
| 总文档数 | 109800 |
| 总查询数 | 109800 |
| 索引吞吐 | 1405 doc/s |
| 纯 BM25 搜索延迟 | 0.82 ms/query |
| +桥扩展搜索延迟 | 1.00 ms/query |
| 总耗时 | 557s (9.3 min) |

## 分语言对比

| 语种 | 纯 BM25 | +桥扩展 | 差值 | 搜索(ms/q) | 桥搜索(ms/q) |
|------|---------|--------|------|-----------|-------------|
| acm_Arab | 0.5015 | 0.5003 | -0.0012 | 0.45 | 0.50 |
| afr_Latn | 0.6334 | 0.6352 | +0.0018 | 0.50 | 0.68 |
| als_Latn | 0.5597 | 0.5663 | +0.0066 | 0.66 | 0.81 |
| amh_Ethi | 0.2650 | 0.2449 | -0.0201 | 0.87 | 0.92 |
| apc_Arab | 0.5470 | 0.5481 | +0.0011 | 0.46 | 0.51 |
| arb_Arab | 0.5375 | 0.5421 | +0.0046 | 0.46 | 0.51 |
| arb_Latn | 0.1371 | 0.1329 | -0.0043 | 0.64 | 0.85 |
| ars_Arab | 0.4499 | 0.4554 | +0.0054 | 0.45 | 0.52 |
| ary_Arab | 0.4463 | 0.4391 | -0.0072 | 0.61 | 0.71 |
| arz_Arab | 0.4658 | 0.4698 | +0.0040 | 0.49 | 0.52 |
| asm_Beng | 0.4209 | 0.4065 | -0.0144 | 0.71 | 0.83 |
| azj_Latn | 0.5458 | 0.5371 | -0.0087 | 0.66 | 0.85 |
| bam_Latn | 0.4412 | 0.4243 | -0.0169 | 0.88 | 1.03 |
| ben_Beng | 0.6103 | 0.6129 | +0.0026 | 0.35 | 0.47 |
| ben_Latn | 0.5468 | 0.5572 | +0.0104 | 0.60 | 0.75 |
| bod_Tibt | 0.0701 | 0.0523 | -0.0178 | 1.32 | 1.46 |
| bul_Cyrl | 0.6106 | 0.6081 | -0.0024 | 0.61 | 0.83 |
| cat_Latn | 0.6666 | 0.6628 | -0.0037 | 0.56 | 0.76 |
| ceb_Latn | 0.5191 | 0.5197 | +0.0006 | 0.61 | 0.77 |
| ces_Latn | 0.5951 | 0.6012 | +0.0060 | 0.46 | 0.63 |
| ckb_Arab | 0.3132 | 0.3045 | -0.0087 | 1.12 | 1.13 |
| dan_Latn | 0.6104 | 0.6082 | -0.0023 | 0.51 | 0.75 |
| deu_Latn | 0.6818 | 0.6935 | +0.0117 | 0.39 | 0.58 |
| ell_Grek | 0.4925 | 0.4808 | -0.0117 | 0.92 | 1.06 |
| eng_Latn | 0.6885 | 0.7055 | +0.0170 | 0.44 | 0.71 |
| est_Latn | 0.5401 | 0.5412 | +0.0011 | 0.44 | 0.62 |
| eus_Latn | 0.6079 | 0.6072 | -0.0007 | 0.61 | 0.79 |
| fin_Latn | 0.6291 | 0.6270 | -0.0021 | 0.47 | 0.60 |
| fra_Latn | 0.6623 | 0.6576 | -0.0047 | 0.59 | 0.79 |
| fuv_Latn | 0.1519 | 0.1723 | +0.0204 | 0.58 | 0.82 |
| gaz_Latn | 0.3751 | 0.3550 | -0.0202 | 0.83 | 1.02 |
| grn_Latn | 0.5159 | 0.5201 | +0.0042 | 0.83 | 1.02 |
| guj_Gujr | 0.3504 | 0.3375 | -0.0128 | 0.66 | 0.86 |
| hat_Latn | 0.4969 | 0.4960 | -0.0009 | 0.74 | 1.16 |
| hau_Latn | 0.3922 | 0.3857 | -0.0065 | 0.98 | 1.21 |
| heb_Hebr | 0.3348 | 0.3174 | -0.0175 | 1.03 | 1.22 |
| hin_Deva | 0.5339 | 0.5536 | +0.0197 | 0.47 | 0.67 |
| hin_Latn | 0.5333 | 0.5356 | +0.0023 | 0.59 | 0.78 |
| hrv_Latn | 0.6358 | 0.6258 | -0.0100 | 0.48 | 0.64 |
| hun_Latn | 0.6353 | 0.6341 | -0.0011 | 0.51 | 0.67 |
| hye_Armn | 0.1233 | 0.1011 | -0.0222 | 1.53 | 1.66 |
| ibo_Latn | 0.2734 | 0.2640 | -0.0094 | 0.94 | 1.12 |
| ilo_Latn | 0.5397 | 0.5284 | -0.0113 | 0.75 | 0.88 |
| ind_Latn | 0.6715 | 0.6702 | -0.0013 | 0.39 | 0.58 |
| isl_Latn | 0.5450 | 0.5305 | -0.0145 | 0.75 | 0.93 |
| ita_Latn | 0.6861 | 0.6782 | -0.0080 | 0.58 | 0.84 |
| jav_Latn | 0.6139 | 0.6159 | +0.0020 | 0.61 | 0.76 |
| jpn_Jpan | 0.7064 | 0.7053 | -0.0011 | 0.33 | 0.44 |
| kac_Latn | 0.3843 | 0.3593 | -0.0250 | 1.01 | 1.15 |
| kan_Knda | 0.4383 | 0.4225 | -0.0158 | 0.68 | 0.84 |
| kat_Geor | 0.2390 | 0.2229 | -0.0161 | 1.06 | 1.15 |
| kaz_Cyrl | 0.4684 | 0.4514 | -0.0170 | 0.87 | 1.02 |
| kea_Latn | 0.5102 | 0.5241 | +0.0139 | 0.60 | 0.77 |
| khk_Cyrl | 0.3630 | 0.3361 | -0.0270 | 1.10 | 1.29 |
| khm_Khmr | 0.3762 | 0.3683 | -0.0080 | 0.94 | 0.97 |
| kin_Latn | 0.4649 | 0.4474 | -0.0175 | 1.00 | 1.16 |
| kir_Cyrl | 0.5031 | 0.5065 | +0.0033 | 0.85 | 1.12 |
| kor_Hang | 0.6307 | 0.6275 | -0.0032 | 0.41 | 0.60 |
| lao_Laoo | 0.2606 | 0.2580 | -0.0026 | 1.15 | 1.24 |
| lin_Latn | 0.3468 | 0.3308 | -0.0159 | 0.71 | 1.19 |
| lit_Latn | 0.6457 | 0.6315 | -0.0142 | 0.57 | 0.82 |
| lug_Latn | 0.2830 | 0.2777 | -0.0054 | 0.94 | 1.08 |
| luo_Latn | 0.3843 | 0.3659 | -0.0184 | 0.89 | 1.11 |
| lvs_Latn | 0.6096 | 0.6000 | -0.0097 | 0.78 | 0.91 |
| mal_Mlym | 0.4972 | 0.4766 | -0.0206 | 0.68 | 0.92 |
| mar_Deva | 0.5598 | 0.5594 | -0.0004 | 0.48 | 0.63 |
| mkd_Cyrl | 0.5526 | 0.5375 | -0.0151 | 0.91 | 1.30 |
| mlt_Latn | 0.5618 | 0.5308 | -0.0310 | 1.00 | 1.25 |
| mri_Latn | 0.3068 | 0.2920 | -0.0148 | 1.11 | 1.27 |
| mya_Mymr | 0.2723 | 0.2677 | -0.0046 | 1.54 | 1.62 |
| nld_Latn | 0.6669 | 0.6658 | -0.0011 | 0.50 | 0.74 |
| nob_Latn | 0.6062 | 0.6121 | +0.0059 | 0.56 | 0.75 |
| npi_Deva | 0.4975 | 0.4911 | -0.0064 | 0.63 | 0.74 |
| npi_Latn | 0.4113 | 0.4212 | +0.0099 | 0.67 | 0.75 |
| nso_Latn | 0.3911 | 0.3900 | -0.0011 | 1.29 | 1.53 |
| nya_Latn | 0.3297 | 0.3302 | +0.0005 | 0.81 | 1.17 |
| ory_Orya | 0.0502 | 0.0376 | -0.0126 | 1.80 | 2.06 |
| pan_Guru | 0.1162 | 0.1033 | -0.0129 | 1.98 | 1.97 |
| pbt_Arab | 0.3727 | 0.3692 | -0.0035 | 1.12 | 1.11 |
| pes_Arab | 0.6203 | 0.6148 | -0.0054 | 0.59 | 0.63 |
| plt_Latn | 0.4909 | 0.4561 | -0.0348 | 1.24 | 1.35 |
| pol_Latn | 0.6149 | 0.6165 | +0.0015 | 0.56 | 0.77 |
| por_Latn | 0.6589 | 0.6641 | +0.0052 | 0.60 | 0.84 |
| ron_Latn | 0.6500 | 0.6468 | -0.0032 | 0.73 | 0.92 |
| rus_Cyrl | 0.6636 | 0.6719 | +0.0083 | 0.51 | 0.79 |
| shn_Mymr | 0.2511 | 0.2414 | -0.0097 | 2.21 | 2.10 |
| sin_Latn | 0.3317 | 0.3273 | -0.0045 | 1.24 | 1.52 |
| sin_Sinh | 0.3411 | 0.3233 | -0.0178 | 1.48 | 1.52 |
| slk_Latn | 0.6178 | 0.6104 | -0.0074 | 0.73 | 0.91 |
| slv_Latn | 0.5750 | 0.5766 | +0.0016 | 0.64 | 0.94 |
| sna_Latn | 0.4673 | 0.4535 | -0.0138 | 0.81 | 0.98 |
| snd_Arab | 0.3386 | 0.3280 | -0.0106 | 1.18 | 1.21 |
| som_Latn | 0.3359 | 0.3334 | -0.0025 | 1.14 | 1.30 |
| sot_Latn | 0.4070 | 0.3864 | -0.0206 | 0.99 | 1.22 |
| spa_Latn | 0.5444 | 0.5717 | +0.0273 | 0.73 | 0.86 |
| srp_Cyrl | 0.5767 | 0.5678 | -0.0089 | 0.85 | 1.29 |
| ssw_Latn | 0.3494 | 0.3429 | -0.0065 | 0.96 | 0.99 |
| sun_Latn | 0.4882 | 0.4892 | +0.0010 | 0.81 | 1.05 |
| swe_Latn | 0.6796 | 0.6834 | +0.0037 | 0.68 | 0.87 |
| swh_Latn | 0.5902 | 0.5847 | -0.0055 | 0.92 | 1.00 |
| tam_Taml | 0.5980 | 0.5893 | -0.0087 | 0.61 | 0.78 |
| tel_Telu | 0.4430 | 0.4218 | -0.0212 | 0.97 | 1.17 |
| tgk_Cyrl | 0.4674 | 0.4345 | -0.0330 | 1.23 | 1.47 |
| tgl_Latn | 0.6074 | 0.5915 | -0.0158 | 0.79 | 1.04 |
| tha_Thai | 0.6382 | 0.6372 | -0.0010 | 0.51 | 0.62 |
| tir_Ethi | 0.1523 | 0.1323 | -0.0200 | 1.71 | 1.73 |
| tsn_Latn | 0.4494 | 0.4295 | -0.0199 | 1.06 | 1.18 |
| tso_Latn | 0.5329 | 0.5218 | -0.0112 | 1.19 | 1.43 |
| tur_Latn | 0.6298 | 0.6291 | -0.0007 | 0.38 | 0.62 |
| ukr_Cyrl | 0.6006 | 0.5847 | -0.0159 | 0.65 | 1.05 |
| urd_Arab | 0.5252 | 0.5275 | +0.0022 | 0.68 | 0.76 |
| urd_Latn | 0.2271 | 0.2469 | +0.0197 | 0.75 | 0.97 |
| uzn_Latn | 0.5884 | 0.5780 | -0.0104 | 0.90 | 1.15 |
| vie_Latn | 0.7092 | 0.6989 | -0.0103 | 0.55 | 0.75 |
| war_Latn | 0.6394 | 0.6315 | -0.0079 | 2.70 | 3.40 |
| wol_Latn | 0.2896 | 0.2990 | +0.0093 | 1.43 | 1.47 |
| xho_Latn | 0.3826 | 0.3722 | -0.0104 | 1.03 | 1.31 |
| yor_Latn | 0.1723 | 0.1710 | -0.0013 | 1.13 | 1.24 |
| zho_Hans | 0.7209 | 0.7216 | +0.0007 | 0.34 | 0.50 |
| zho_Hant | 0.7015 | 0.7056 | +0.0041 | 0.41 | 0.65 |
| zsm_Latn | 0.6526 | 0.6540 | +0.0014 | 0.55 | 0.81 |
| zul_Latn | 0.3583 | 0.3482 | -0.0101 | 0.89 | 1.25 |
| **平均** | **0.4811** | **0.4754** | **-0.0057** | 0.82 | 1.00 |

## 排行榜

| 排名 | 模型 | nDCG@10 |
|------|------|---------|
| #1 | Mira190/Euler-Legal-Embedding-V1 | 0.9692 |
| #2 | Qwen/Qwen3-Embedding-8B | 0.9662 |
| #3 | Octen/Octen-Embedding-8B | 0.9646 |
| #4 | Qwen/Qwen3-VL-Embedding-8B | 0.9607 |
| #5 | LingoIITGN/qwen-indic-v1 | 0.9516 |
| #6 | BAAI/bge-multilingual-gemma2 | 0.9500 |
| #7 | Octen/Octen-Embedding-4B | 0.9462 |
| #8 | Qwen/Qwen3-VL-Embedding-2B | 0.9443 |
| #9 | clips/e5-base-trm-nl | 0.9380 |
| #10 | clips/e5-large-trm-nl | 0.9305 |
| #11 | clips/e5-small-trm-nl | 0.9244 |
| #12 | Qwen/Qwen3-Embedding-4B | 0.9219 |
| #13 | Alibaba-NLP/gte-Qwen2-7B-instruct | 0.9203 |
| #14 | ICT-TIME-and-Querit/ICT-TIME-and-Querit-embedding-v1 | 0.9058 |
| #15 | ICT-TIME-and-Querit/BOOM_4B_v1 | 0.9031 |
| #16 | BidirLM/BidirLM-Omni-2.5B-Embedding | 0.9030 |
| #17 | SamilPwC-AXNode-GenAI/PwC-Embedding_expr | 0.8967 |
| #18 | Cohere/Cohere-embed-multilingual-v3.0 | 0.8927 |
| #19 | Alibaba-NLP/gte-multilingual-base | 0.8920 |
| #20 | Bytedance/Seed1.6-embedding-1215 | 0.8912 |
| #21 | Octen/Octen-Embedding-0.6B | 0.8911 |
| #22 | BidirLM/BidirLM-1.7B-Embedding | 0.8849 |
| #23 | Lajavaness/bilingual-embedding-large | 0.8845 |
| #24 | BidirLM/BidirLM-1B-Embedding | 0.8779 |
| #25 | BAAI/bge-m3 | 0.8778 |
| #26 | Alibaba-NLP/gte-Qwen2-1.5B-instruct | 0.8739 |
| #27 | OrdalieTech/Solon-embeddings-large-0.1 | 0.8737 |
| #28 | GritLM/GritLM-7B | 0.8530 |
| #29 | IEITYuan/Yuan-embedding-2.0-en | 0.8521 |
| #30 | GritLM/GritLM-8x7B | 0.8491 |
| #31 | Qwen/Qwen3-Embedding-0.6B | 0.8486 |
| #32 | Lajavaness/bilingual-embedding-base | 0.8480 |
| #33 | HIT-TMG/KaLM-embedding-multilingual-mini-v1 | 0.8427 |
| #34 | codefuse-ai/F2LLM-0.6B | 0.8384 |
| #35 | Salesforce/SFR-Embedding-Mistral | 0.8329 |
| #36 | Cohere/Cohere-embed-multilingual-light-v3.0 | 0.8292 |
| #37 | BidirLM/BidirLM-0.6B-Embedding | 0.8258 |
| #38 | Linq-AI-Research/Linq-Embed-Mistral | 0.8239 |
| #39 | Salesforce/SFR-Embedding-2_R | 0.8082 |
| #40 | Lajavaness/bilingual-embedding-small | 0.8036 |
| #41 | Alibaba-NLP/gte-Qwen1.5-7B-instruct | 0.7793 |
| #42 | HIT-TMG/KaLM-embedding-multilingual-mini-instruct-v1 | 0.7389 |
| #43 | BidirLM/BidirLM-270M-Embedding | 0.7361 |
| #44 | Omartificial-Intelligence-Space/Arabert-all-nli-triplet-Matryoshka | 0.7360 |
| #45 | Sailesh97/Hinvec | 0.7247 |
| #46 | Omartificial-Intelligence-Space/Arabic-all-nli-triplet-Matryoshka | 0.7136 |
| #47 | Omartificial-Intelligence-Space/Marbert-all-nli-triplet-Matryoshka | 0.7003 |
| #48 | Omartificial-Intelligence-Space/Arabic-labse-Matryoshka | 0.6788 |
| #49 | NovaSearch/jasper_en_vision_language_v1 | 0.6391 |
| #50 | NovaSearch/stella_en_1.5B_v5 | 0.6054 |
| #51 | BakaSearch（纯 BM25） | 0.4811 ← |
| #52 | BakaSearch（+桥扩展） | 0.4754 ← |
| #53 | Omartificial-Intelligence-Space/Arabic-mpnet-base-all-nli-triplet | 0.4646 |
| #54 | DeepPavlov/rubert-base-cased | 0.4369 |
| #55 | Haon-Chen/speed-embedding-7b-instruct | 0.4044 |
| #56 | bigscience/sgpt-bloom-7b1-msmarco | 0.2051 |
| #57 | Cohere/Cohere-embed-english-v3.0 | 0.1958 |
| #58 | VPLabs/SearchMap_Preview | 0.1929 |
| #59 | NovaSearch/stella_en_400M_v5 | 0.1894 |
| #60 | Jaume/gemma-2b-embeddings | 0.1302 |
| #61 | avsolatorio/GIST-large-Embedding-v0 | 0.1002 |
| #62 | BAAI/bge-base-en-v1.5 | 0.0990 |
| #63 | Cohere/Cohere-embed-english-light-v3.0 | 0.0851 |
| #64 | avsolatorio/GIST-Embedding-v0 | 0.0827 |
| #65 | BAAI/bge-large-en-v1.5 | 0.0804 |
| #66 | WhereIsAI/UAE-Large-V1 | 0.0750 |
| #67 | avsolatorio/GIST-small-Embedding-v0 | 0.0649 |
| #68 | Snowflake/snowflake-arctic-embed-m-long | 0.0623 |
| #69 | avsolatorio/NoInstruct-small-Embedding-v0 | 0.0606 |
| #70 | BAAI/bge-small-en-v1.5 | 0.0572 |
| #71 | Snowflake/snowflake-arctic-embed-m-v1.5 | 0.0551 |
| #72 | abhinand/MedEmbed-small-v0.1 | 0.0546 |
| #73 | Mihaiii/Ivysaur | 0.0545 |
| #74 | Snowflake/snowflake-arctic-embed-l | 0.0507 |
| #75 | Snowflake/snowflake-arctic-embed-s | 0.0446 |
| #76 | Mihaiii/Squirtle | 0.0426 |
| #77 | Snowflake/snowflake-arctic-embed-m | 0.0426 |
| #78 | aari1995/German_Semantic_STS_V2 | 0.0389 |
| #79 | Mihaiii/Venusaur | 0.0341 |
| #80 | Mihaiii/Wartortle | 0.0332 |
| #81 | Snowflake/snowflake-arctic-embed-xs | 0.0309 |
| #82 | DeepPavlov/rubert-base-cased-sentence | 0.0291 |
| #83 | ai-forever/ru-en-RoSBERTa | 0.0260 |
| #84 | ai-forever/sbert_large_mt_nlu_ru | 0.0243 |
| #85 | ai-forever/sbert_large_nlu_ru | 0.0234 |
| #86 | Mihaiii/Bulbasaur | 0.0211 |
| #87 | DeepPavlov/distilrubert-small-cased-conversational | 0.0194 |
| #88 | Mihaiii/gte-micro | 0.0168 |
| #89 | brahmairesearch/slx-v0.1 | 0.0157 |
| #90 | Mihaiii/gte-micro-v4 | 0.0154 |

