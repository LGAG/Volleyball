using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace volleyball
{
    public partial class Form1 : Form
    {
        string[] tech_names = { "发球", "扣球", "拦网", "传球", "一传", "防守" };
        const int START_POS_X = 86;
        const int START_POS_Y = 116;
        const int PAD_X_1ST = 1;
        const int PAD_X_2ND = 10;
        const int PAD_Y_1ST = 1;
        const int PAD_Y_2ND = 75;
        const int BTN_SIZE_X = 35;
        const int BTN_SIZE_Y = 33;
        const int INDEX_X = 6;
        const int INDEX_Y = 7;
        const int TEAMS = 2;
        const int RANKS = 3;

        int[] WEIGHT = { 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 };
        string temp = "";

        public Form1()
        {

            this.btn = new System.Windows.Forms.Button[INDEX_X * RANKS * INDEX_Y * TEAMS];
            this.tech_label = new System.Windows.Forms.Label[INDEX_X];
            this.player_label = new System.Windows.Forms.Label[INDEX_Y * TEAMS];

            for(int i = 0; i < INDEX_X; i++)
            {
                tech_label[i] = new System.Windows.Forms.Label();
                this.Controls.Add(this.tech_label[i]);
                this.tech_label[i].BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
                this.tech_label[i].Font = new System.Drawing.Font("宋体", 10F);
                this.tech_label[i].Location = new System.Drawing.Point(START_POS_X + (3 * i + 1) * (BTN_SIZE_X + PAD_X_1ST) + i * PAD_X_2ND, 67);
                this.tech_label[i].Name = "tech_label" + i.ToString();
                this.tech_label[i].Size = new System.Drawing.Size(37, 25);
                this.tech_label[i].TabIndex = 270;
                this.tech_label[i].Text = tech_names[i];
            }

            for (int i = 0; i < INDEX_Y * TEAMS; i++)
            {
                player_label[i] = new System.Windows.Forms.Label();
                this.Controls.Add(this.player_label[i]);
                this.player_label[i].BorderStyle = System.Windows.Forms.BorderStyle.Fixed3D;
                this.player_label[i].Location = new System.Drawing.Point(7, START_POS_Y + PAD_Y_1ST * i + PAD_Y_2ND * (i / 7) + BTN_SIZE_Y * i);
                this.player_label[i].Name = "player_label" + i.ToString();
                this.player_label[i].Size = new System.Drawing.Size(60, 33);
                this.player_label[i].TabIndex = 252;
                this.player_label[i].Text = "unknown ";
                this.player_label[i].Click += new System.EventHandler(this.label_Click);

                this.Controls.Add(this.btn[i]);
                for (int j = 0; j < INDEX_X * RANKS; j++)
                {
                    btn[i * INDEX_X * RANKS + j] = new System.Windows.Forms.Button();
                    this.Controls.Add(this.btn[i * INDEX_X * RANKS + j]);
                    if (j % 3 == 0)
                    {
                        this.btn[i * INDEX_X * RANKS + j].BackColor = System.Drawing.Color.LightGreen;
                    }
                    else if (j % 3 == 1)
                    {
                        this.btn[i * INDEX_X * RANKS + j].BackColor = System.Drawing.Color.Yellow;
                    }
                    else if (j % 3 == 2)
                    {
                        this.btn[i * INDEX_X * RANKS + j].BackColor = System.Drawing.Color.Red;
                    }
                    else
                    {
                        //throw excpet, @TheVeryDarkness, please help me.
                    }
                    this.btn[i * INDEX_X * RANKS + j].ForeColor = System.Drawing.SystemColors.ControlText;
                    this.btn[i * INDEX_X * RANKS + j].Location = new System.Drawing.Point(START_POS_X + PAD_X_1ST * j + PAD_X_2ND * (j / 3) + BTN_SIZE_X * j, START_POS_Y + PAD_Y_1ST * i + PAD_Y_2ND * (i / 7) + BTN_SIZE_Y * i);
                    this.btn[i * INDEX_X * RANKS + j].Name = "button" + (i * INDEX_X * RANKS + j).ToString();
                    this.btn[i * INDEX_X * RANKS + j].Size = new System.Drawing.Size(35, 33);
                    this.btn[i * INDEX_X * RANKS + j].TabIndex = 0;
                    this.btn[i * INDEX_X * RANKS + j].Text = "0";
                    this.btn[i * INDEX_X * RANKS + j].UseVisualStyleBackColor = false;
                    this.btn[i * INDEX_X * RANKS + j].MouseDown += new System.Windows.Forms.MouseEventHandler(this.button_MouseClick);
                }
            }
            InitializeComponent();
        }

        private void button_MouseClick(object sender, MouseEventArgs e)
        {
            if(e.Button == MouseButtons.Right)
            {
                ((Button)sender).Text = (int.Parse(((Button)sender).Text) - 1).ToString();
            }
            else if (e.Button == MouseButtons.Left)
            {
                ((Button)sender).Text = (int.Parse(((Button)sender).Text) + 1).ToString();
            }
        }

        private void Form1_Load(object sender, EventArgs e)
        {

        }

        private void label_Click(object sender, EventArgs e)
        {

        }
    }
}
