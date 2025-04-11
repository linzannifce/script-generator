import React, { useState, useEffect } from 'react';
import {
  Container, Box, Card, CardContent, Typography, Button, TextField,
  Grid, CircularProgress, IconButton, Snackbar, Paper, Divider
} from '@mui/material';
import { ContentCopy, Download, History } from '@mui/icons-material';

const defaultPrompts = {
  'male-chat': '场景：校园里的偶遇。女生主动追求男生，对话要体现出男生的矜持和礼貌。',
  'female-chat': '场景：咖啡厅相遇。展现女生的温柔与智慧。',
  'female-game': '场景：女性玩家在游戏中结识知心好友。',
  'male-game': '场景：男性玩家在游戏中展现领导力与团队协作。',
  'female-dating': '场景：都市女性寻找真爱的故事。',
  'male-dating': '场景：事业有成的男性寻找人生伴侣。'
};

const ScriptGenerator = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('scriptHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleTypeSelect = (typeId) => {
    setSelectedType(typeId);
    setPrompt(defaultPrompts[typeId] || '');
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      // 这里应该是实际的API调用
      // const response = await axios.post('your-api-endpoint', { prompt, type: selectedType });
      // setResult(response.data.result);
      
      // 模拟API响应
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mockResult = `这是一个示例对话：\n\n男：最近常看到你在图书馆学习呢。\n女：是啊，我觉得安静的环境很适合看书。\n男：你喜欢看什么类型的书？\n女：我比较喜欢文学作品，你呢？`;
      setResult(mockResult);
      
      // 保存到历史记录
      const newHistory = [...history, { type: selectedType, prompt, result: mockResult, date: new Date().toISOString() }];
      setHistory(newHistory);
      localStorage.setItem('scriptHistory', JSON.stringify(newHistory));
    } catch (error) {
      console.error('生成失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setSnackbarOpen(true);
  };

  const handleDownload = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `脚本_${new Date().toISOString().slice(0,10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#1976d2' }}>
          AI脚本创作助手
        </Typography>
        
        <Grid container spacing={3}>
          {scriptTypes.map((type) => (
            <Grid item xs={12} sm={6} md={4} key={type.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 3
                  },
                  bgcolor: selectedType === type.id ? 'primary.light' : 'background.paper'
                }}
                onClick={() => handleTypeSelect(type.id)}
              >
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {type.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {type.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {selectedType && (
          <Box sx={{ mt: 4 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              label="输入提示词（可选）"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleGenerate}
              disabled={loading}
              fullWidth
              sx={{ height: 50 }}
            >
              {loading ? <CircularProgress size={24} /> : '生成脚本'}
            </Button>
          </Box>
        )}

        {result && (
          <Paper elevation={3} sx={{ mt: 4, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <IconButton onClick={handleCopy}>
                <ContentCopy />
              </IconButton>
              <IconButton onClick={handleDownload}>
                <Download />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={8}
              value={result}
              label="生成结果"
              variant="outlined"
              InputProps={{
                readOnly: true,
              }}
            />
          </Paper>
        )}

        {history.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              <History sx={{ mr: 1, verticalAlign: 'middle' }} />
              历史记录
            </Typography>
            {history.slice(-5).reverse().map((item, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle2" color="primary">
                  {new Date(item.date).toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {item.result.substring(0, 100)}...
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message="已复制到剪贴板"
      />
    </Container>
  );
};

export default ScriptGenerator;